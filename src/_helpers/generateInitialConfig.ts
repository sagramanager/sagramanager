import { randomBytes } from "crypto";
import fs from "fs";
import dotenv from 'dotenv';
import { logger } from "../_helpers/logger";

export function generateInitialConfig() {
    let JWT_PRIVATE_KEY = randomBytes(256).toString('base64');
    fs.writeFile('.env', `JWT_PRIVATE_KEY=${JWT_PRIVATE_KEY}`, (err) => {});
    dotenv.config();
    logger('Generated new .env file with JWT private key', 'info');
}