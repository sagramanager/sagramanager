import socketio from 'socket.io';
import { logger } from './logger';
import { validateAccessToken } from './auth';

export var io = undefined;

export function initializeSocketServer(httpServer: any) {
    io = new socketio.Server(httpServer);
    
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if(token) {
            validateAccessToken(token).then((isTokenValid) => {
                if(isTokenValid) {
                    next();
                } else {
                    next(new Error("Access Token is not valid"));
                }
            }).catch((err) => {
                next(err);
            });
        } else {
            next(new Error("Auth required"));
        }
    });

    io.on('connection', (socket: any) => {
        console.log(`New client connected (id=${socket.id} ip=${socket.handshake.address})`);
    
        socket.on('disconnect', () => {
            console.log(`Client disconnected (id=${socket.id} ip=${socket.handshake.address})`);
        });
    });

    logger('Socket server started', 'verbose');
}