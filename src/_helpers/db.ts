import "reflect-metadata";
import { createConnection } from "typeorm";
import { logger } from "./logger";
import { checkIfUsersTableEmptyAndUpdate } from "./auth";
import path from "path";

export var connection = undefined;

export function initializeDB(){
    createConnection({
        type: "sqlite",
        database: "server.db",
        entities: [
            path.join(__dirname, "..", "entity", "*.ts")
        ],
        synchronize: true,
        logging: false
    }).then((new_connection) => {
        connection = new_connection;
        logger('Initialized db connection', 'verbose');
        checkIfUsersTableEmptyAndUpdate();
    }).catch(error => {
        throw error;
    });
}
