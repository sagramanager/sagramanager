import express from 'express';
import { body, validationResult } from 'express-validator';
import { Logs } from '../_globals/logs';
import { version } from './version';
import { connection } from './db';
import { User } from '../entity/User';
import { Order } from '../entity/Order';
import { Foodstuff } from '../entity/Foodstuff';
import { addUser, authenticate, validateAccessToken, requireRole } from '../_helpers/auth';
import { validateOrderFoodstuffs } from './apiRoutesValidators';
import { AddUserSettings } from '../_models/AddUserSettings';

export var apiRouter = express.Router();
apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: false }));

/**
 * GET /foodstuffs
 * @description Get foodstuffs list.
 * @response 200 - List of foodstuffs.
 * @responseContent {Foodstuff[]} 200.application/json
 * @tag foodstuff
 */
 apiRouter.get('/foodstuffs', function(req, res) {
    let foodstuffRepository = connection.getRepository(Foodstuff);
    foodstuffRepository.find().then((foodstuffs: Foodstuff[]) => {
        res.json(foodstuffs);
    });
});

/**
 * POST /foodstuffs
 * @description Add new foodstuff.
 * @response 400 - Api request malformed.
 * @responseContent {ValidationError} 400.application/json
 * @response 200 - Add foodstuff response.
 * @responseContent {FoodstuffAdd} 200.application/json
 * @bodyContent {FoodstuffAddRequest} application/x-www-form-urlencoded
 * @bodyContent {FoodstuffAddRequest} application/json
 * @bodyRequired
 * @tag foodstuff
 */
 apiRouter.post('/foodstuffs', 
    body('name').isLength({ min: 5 }),
    body('price').isLength({ min: 5 }),
 function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let foodstuff = new Foodstuff();
    foodstuff.name = req.body.name;
    if(req.body.shortName) foodstuff.shortName = req.body.shortName;
    if(req.body.description) foodstuff.description = req.body.description;
    foodstuff.price = req.body.price;

    connection.getRepository(Foodstuff).save(foodstuff).then((foodstuff: Foodstuff) => {
        res.json({
            status: "ok",
            foodstuff: foodstuff
        });
    });
});

/**
 * GET /orders
 * @description Get orders list.
 * @response 200 - List of orders.
 * @responseContent {Order[]} 200.application/json
 * @tag orders
 */
 apiRouter.get('/orders', function(req, res) {
    let orderRepository = connection.getRepository(Order);
    orderRepository.find().then((orders: Order[]) => {
        res.json(orders);
    });
});

/**
 * POST /orders
 * @description Add new order.
 * @response 400 - Api request malformed.
 * @responseContent {ValidationError} 400.application/json
 * @response 200 - Add order response.
 * @responseContent {OrderAdd} 200.application/json
 * @bodyContent {OrderAddRequest} application/json
 * @bodyRequired
 * @tag orders
 */
 apiRouter.post('/orders',
    body('foodstuffs').isLength({ min: 5 }).custom(validateOrderFoodstuffs()),
 function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let order = new Order();
    order.customer = "customer";
    order.places = 7;
    order.tableNumber = 9;
    order.waiter = "Paulo";
    order.notes = "Note blablabla";
    order.takeAway = false;
    order.foodstuff = [
        {
            foodstuff: 1,
            amount: 2,
            notes: "nota1"
        },
        {
            foodstuff: 2,
            amount: 8,
            notes: "nota2"
        }
    ];

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
 * @response 200 - List of user objects.
 * @responseContent {User[]} 200.application/json
 * @tag users
 */
apiRouter.get('/users', function(req, res) {
    let userRepository = connection.getRepository(User);
    userRepository.find().then((users: User[]) => {
        users.forEach((u) => { delete u["password"] });
        res.json(users);
    });
});

/**
 * POST /users
 * @description Create a new user.
 * @response 400 - Api request malformed.
 * @responseContent {ValidationError} 400.application/json
 * @response 200 - Add user response.
 * @responseContent {UserAdd} 200.application/json
 * @bodyContent {UserAddRequest} application/x-www-form-urlencoded
 * @bodyContent {UserAddRequest} application/json
 * @bodyRequired
 * @tag users
 */
apiRouter.post('/users',
    body('username').isLength({ min: 5 }),
    body('password').isLength({ min: 5 }),
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
 * @response 401 - Auth error.
 * @responseContent {AuthErrorResponse} 401.application/json
 * @response 200 - User Object.
 * @responseContent {User} 400.application/json
 * @tag user
 */
 apiRouter.get('/profile', requireRole(), function(req: any, res) {
    res.send(req.user);
});

/**
 * POST /login
 * @description Create a new user.
 * @response 400 - Api request malformed.
 * @responseContent {ValidationError} 400.application/json
 * @response 401 - Auth error.
 * @responseContent {AuthErrorResponse} 401.application/json
 * @response 200 - Add user response.
 * @responseContent {AuthResponse} 200.application/json
 * @bodyContent {LoginRequest} application/x-www-form-urlencoded
 * @bodyContent {LoginRequest} application/json
 * @bodyRequired
 * @tag login
 */
 apiRouter.post('/login',
 body('username').isLength({ min: 5 }),
 body('password').isLength({ min: 5 }),
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
 * @response 400 - Api request malformed.
 * @responseContent {ValidationError} 400.application/json
 * @response 401 - Auth error.
 * @responseContent {AuthErrorResponse} 401.application/json
 * @response 200 - Validation Successfull response.
 * @responseContent {ValidationSuccessfull} 200.application/json
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
 * @response 200 - Version object.
 * @responseContent {Version} 200.application/json
 */
apiRouter.get('/version', function(req, res) {
    res.send({
        version: version
    });
});

/**
 * GET /logs
 * @description Get a list of logs.
 * @response 200 - Logs object.
 * @responseContent {Logs} 200.application/json
 */
apiRouter.get('/logs', function(req, res) {
    res.json({
        logs: Logs
    });
});

/**
 * GET /ping
 * @description Reply with "pong".
 * @response 200 - pong.
 * @responseContent {Pong} 200.text/plain
 */
apiRouter.get('/ping', function(req, res) {
    res.type('text/plain');
    res.send('pong');
});