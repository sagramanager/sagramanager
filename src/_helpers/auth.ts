import { connection } from './db';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AddUserSettings } from '../_models/AddUserSettings';
import { AuthenticateSuccessResponse } from '../_models/AuthenticateSuccessResponse';
import { logger } from "./logger";

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
}

export function addUser(settings: AddUserSettings): Promise<User> {
    return new Promise<User>((resolve, reject) => {
        let default_settings = {
            username: null,
            name: null,
            password: null,
            isHidden: false
        }
        settings = Object.assign(default_settings, settings);

        let user = new User();
        user.username = settings.username;
        user.name = settings.name;
        user.password = hashPassword(settings.password);
        user.isHidden = settings.isHidden;

        try {
            connection.getRepository(User).save(user).then((user: User) => {
                logger(`User '${user.username}' was added`, 'info');
                resolve(user);
            });
        } catch(e) {
            reject(e);
        }
    });
}

export function authenticate(username: string, password: string): Promise<AuthenticateSuccessResponse> {
    return new Promise<AuthenticateSuccessResponse>((resolve, reject) => {
        connection.getRepository(User).findOne({ username: username }).then((user: User) => {
            if(!user) {
                reject(new Error('User not found'));
            }
            if(!comparePassword(password, user.password)) {
                reject(new Error('Password is incorrect'));
            }
            delete user['password'];
            jwt.sign({user}, process.env.JWT_PRIVATE_KEY, { expiresIn: '2h' },(err, token) => {
                if(err) { reject(err) }
                resolve({
                    access_token: token,
                    user: user
                });
            });
        }).catch((e) => {
            reject(e);
        });
    });
}

export function validateAccessToken(access_token: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
        jwt.verify(access_token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
            if(err) {
                reject(err);
            }
            resolve(decoded.user);
        });
    });
}

export const requireRole = (role?: string) => {
    return (req, res, next) => {
        let token = undefined;
        if (req.headers && req.headers.authorization) {
            var parts = req.headers.authorization.split(' ');
            if (parts.length == 2) {
              var scheme = parts[0];
              var credentials = parts[1];
      
              if (/^Bearer$/i.test(scheme)) {
                token = credentials;
              } else {
                res.status(401);
                return res.json({
                    status: 'error',
                    message: 'Format is Authorization: Bearer [token]'
                });
              }
            } else {
                res.status(401);
                return res.json({
                    status: 'error',
                    message: 'Format is Authorization: Bearer [token]'
                });
            }
        }

        if(!token) {
            res.status(401);
            return res.json({
                status: 'error',
                message: 'Auth token required'
            });
        }

        validateAccessToken(token).then((user) => {
            req.user = user;
            //check if user has permission
            if(role) {
                if(user.permissions.split(" ").includes(role)) {
                    res.status(403);
                    return res.json({
                        status: 'error',
                        message: 'User does not have permission'
                    });
                }
            }
            next();
        }).catch((e) => {
            res.status(401);
            return res.json({
                status: 'error',
                message: e
            });
        });
    }
}
