import express from 'express';
import { body, validationResult } from 'express-validator';
import { Logs } from '../_globals/logs';
import { version } from './version';
import { connection } from './db';
import { User } from '../entity/User';
import { Order } from '../entity/Order';
import { Foodstuff } from '../entity/Foodstuff';
import { FoodstuffType } from '../entity/FoodstuffType';
import { addUser, authenticate, validateAccessToken, requireRole } from '../_helpers/auth';
import { validateOrderFoodstuffs } from './apiRoutesValidators';
import { AddUserSettings } from '../_models/AddUserSettings';

export var apiRouter = express.Router();
apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: false }));

/**
 * GET /foodstuffTypes
 * @description Get foodstuff types list.
 * @responseComponent {AuthError} 401
 * @responseComponent {FoodstuffTypesListResponse} 200
 * @security bearerAuth
 * @tag foodstuffType
 */
 apiRouter.get('/foodstuffTypes', requireRole(), function(req, res) {
    let foodstuffTypeRepository = connection.getRepository(FoodstuffType);
    foodstuffTypeRepository.find().then((foodstuffTypes: Foodstuff[]) => {
        res.json(foodstuffTypes);
    });
});

/**
 * POST /foodstuffTypes
 * @description Add new foodstuff.
 * @responseComponent {ValidationError} 400
 * @responseComponent {AuthError} 401
 * @responseComponent {AddFoodstuffTypeResponse} 200
 * @bodyComponent {AddFoodstuffTypeRequest}
 * @security bearerAuth
 * @tag foodstuffType
 */
 apiRouter.post('/foodstuffTypes', requireRole(),
    body('name').isLength({ min: 1 }),
 function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let foodstuffType = new FoodstuffType();
    foodstuffType.name = req.body.name;

    connection.getRepository(FoodstuffType).save(foodstuffType).then((foodstuffType: FoodstuffType) => {
        res.json({
            status: "ok",
            foodstuffType: foodstuffType
        });
    });
});

/**
 * GET /foodstuffs
 * @description Get foodstuffs list.
 * @responseComponent {AuthError} 401
 * @responseComponent {FoodstuffsListResponse} 200
 * @security bearerAuth
 * @tag foodstuff
 */
 apiRouter.get('/foodstuffs', requireRole(), function(req, res) {
    let foodstuffRepository = connection.getRepository(Foodstuff);
    foodstuffRepository.find({ relations: ["type"] }).then((foodstuffs: Foodstuff[]) => {
        res.json(foodstuffs);
    });
});

/**
 * POST /foodstuffs
 * @description Add new foodstuff.
 * @responseComponent {ValidationError} 400
 * @responseComponent {AuthError} 401
 * @responseComponent {AddFoodstuffResponse} 200
 * @bodyComponent {AddFoodstuffRequest}
 * @security bearerAuth
 * @tag foodstuff
 */
 apiRouter.post('/foodstuffs', requireRole(),
    body('name').isLength({ min: 1 }),
    //body('price').isLength({ min: 5 }), TODO: add custom price validator
 function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let foodstuff = new Foodstuff();
    foodstuff.name = req.body.name;
    foodstuff.shortName = req.body.shortName;
    foodstuff.description = req.body.description;
    foodstuff.price = req.body.price;
    connection.getRepository(FoodstuffType).findOne(req.body.foodstuffTypeId).then((foodstuffType: FoodstuffType) => {
        foodstuff.type = foodstuffType;

        connection.getRepository(Foodstuff).save(foodstuff).then((foodstuff: Foodstuff) => {
            res.json({
                status: "ok",
                foodstuff: foodstuff
            });
        });
    });
});

/**
 * GET /orders
 * @description Get orders list.
 * @responseComponent {AuthError} 401
 * @responseComponent {OrdersListResponse} 200
 * @security bearerAuth
 * @tag orders
 */
 apiRouter.get('/orders', requireRole(), function(req, res) {
    let orderRepository = connection.getRepository(Order);
    orderRepository.find().then((orders: Order[]) => {
        res.json(orders);
    });
});

/**
 * POST /orders
 * @description Add new order.
 * @responseComponent {ValidationError} 400
 * @responseComponent {AuthError} 401
 * @responseComponent {AddOrderResponse} 200
 * @bodyComponent {AddOrderRequest}
 * @security bearerAuth
 * @tag orders
 */
 apiRouter.post('/orders', requireRole(),
    body('foodstuffs').isLength({ min: 5 }).custom(validateOrderFoodstuffs()),
 function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let order = new Order();
    order.customer = req.body.customer;
    order.places = req.body.places;
    order.tableNumber = req.body.tableNumber;
    order.waiter = req.body.waiter;
    order.notes = req.body.notes;
    order.takeAway = req.body.takeAway;
    order.foodstuff = req.body.foodstuffs;

    connection.getRepository(Order).save(order).then((order: Order) => {
        res.json({
            status: "ok",
            order: order
        });
    });
});

/**
 * GET /users
 * @description Get users list.
 * @responseComponent {AuthError} 401
 * @responseComponent {UsersListResponse} 200
 * @security bearerAuth
 * @tag users
 */
apiRouter.get('/users', requireRole(), function(req, res) {
    let userRepository = connection.getRepository(User);
    userRepository.find().then((users: User[]) => {
        users.forEach((u) => { delete u["password"] });
        res.json(users);
    });
});

/**
 * POST /users
 * @description Create a new user.
 * @responseComponent {ValidationError} 400
 * @responseComponent {AuthError} 401
 * @responseComponent {AddUserResponse} 200
 * @bodyComponent {AddUserRequest}
 * @security bearerAuth
 * @tag users
 */
apiRouter.post('/users', requireRole(),
    body('username').isLength({ min: 2 }),
    body('password').isLength({ min: 2 }),
function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let user_settings: AddUserSettings = {
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        isHidden: req.body.isHidden
    };
    
    addUser(user_settings).then((user) => {
        delete user["password"];
        res.json({
            status: "ok",
            user: user
        });
    });
});

/**
 * GET /profile
 * @description Get profile info.
 * @responseComponent {AuthError} 401
 * @responseComponent {ProfileResponse} 200
 * @security bearerAuth
 * @tag user
 */
apiRouter.get('/profile', requireRole(), function(req: any, res) {
    res.send(req.user);
});

/**
 * POST /login
 * @description Create a new user.
 * @responseComponent {ValidationError} 400
 * @responseComponent {AuthError} 401
 * @responseComponent {AuthResponse} 200
 * @bodyComponent {LoginRequest}
 * @tag login
 */
apiRouter.post('/login',
    body('username').isLength({ min: 2 }),
    body('password').isLength({ min: 2 }),
function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    authenticate(req.body.username, req.body.password).then((response) => {
        delete response.user["password"];
        res.json({
            access_token: response.access_token,
            user: response.user
        });
    }).catch((err) => {
        res.status(401).json({
            status: 'error',
            message: err.message
        });
    });
});

/**
 * POST /validate_token
 * @description Validate JWT Access Token.
 * @responseComponent {ValidationError} 400
 * @responseComponent {AuthError} 401
 * @responseComponent {TokenValidationSuccessfull} 200
 * @bodyComponent {ValidateTokenRequest}
 * @tag login
 */
apiRouter.post('/validate_token', body('access_token').isLength({ min: 5 }), function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    validateAccessToken(req.body.access_token).then((response) => {
        res.json({
            status: "ok",
            user: response
        });
    }).catch((err) => {
        res.status(401).json({
            status: 'error',
            message: err.message
        });
    });
});

/**
 * GET /version
 * @description Get server version.
 * @responseComponent {VersionResponse} 200
 */
apiRouter.get('/version', function(req, res) {
    res.send({
        version: version
    });
});

/**
 * GET /logs
 * @description Get a list of logs.
 * @responseComponent {AuthError} 401
 * @responseComponent {LogsResponse} 200
 * @security bearerAuth
 */
apiRouter.get('/logs', requireRole(), function(req, res) {
    res.json({
        logs: Logs
    });
});

/**
 * GET /ping
 * @description Reply with "pong".
 * @responseComponent {PingResponse} 200
 */
apiRouter.get('/ping', function(req, res) {
    res.type('text/plain');
    res.send('pong');
});