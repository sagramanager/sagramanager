import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import http from 'http';

import { generateInitialConfig } from './_helpers/generateInitialConfig';
if (fs.existsSync(path.join(__dirname, '..', '.env'))) {
	dotenv.config();
} else {
	generateInitialConfig();
}

import openapi from 'openapi-comment-parser';
import swaggerUi from 'swagger-ui-express';

import { logger } from './_helpers/logger'; 
import { apiRouter } from './_helpers/apiRouter';
import { initializeSocketServer } from './_helpers/socketServer';
import { initializeDB } from './_helpers/db';

//Rate limiter configurations
const maxPageRequestPerMinute = 100;
const limiterServeUI = new RateLimiterMemory({
	keyPrefix: 'UI_serve',
	points: maxPageRequestPerMinute,
	duration: 60, // Store number for 1 minute
	blockDuration: 60 * 10, // Block for 10 minutes
});

var uiDistPath = path.join(__dirname, 'UI', 'dist');
if (!fs.existsSync(uiDistPath)) {
    uiDistPath = path.join(__dirname, '..', 'UI', 'dist');
}

const listenPort: number = parseInt(process.env.PORT) || 4466;
const app = express();
const httpServer = new http.Server(app);

const spec = openapi({
    verbose: false
});

function initializeServer() {
    app.disable('x-powered-by');
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    
    httpServer.listen(listenPort, () => { // start up http server
		logger(`sagramanager server running on port ${listenPort}`, 'info');
	});

    app.get('/', (req, res) => {
		limiterServeUI.consume(req.ip).then((data) => {
			res.sendFile('index.html', { root: uiDistPath });
		}).catch((data) => {
			res.status(429).send('Too Many Requests');
		});
	});
	app.use(express.static(uiDistPath));
    app.use('/api/v1', apiRouter);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

	//serve up any files in the ui-dist folder
	app.use(express.static(uiDistPath));
}

function startUp() {
	initializeServer();
	initializeSocketServer(httpServer);
    initializeDB();

	process.on('uncaughtException', (err: Error) => {
		if (!process.versions.hasOwnProperty('electron')) {
			//generateAndSendErrorReport(err);
		}
	});
}

startUp();