import { connection } from './db';
import { Order } from '../entity/Order';

const checkIfFoodstuffExists = async (id): Promise<boolean> => {
    return false;
}

//@ts-ignore
Array.prototype.forEachAsync = async function (fn) {
    for (let t of this) { await fn(t) }
}

export const validateOrderFoodstuffs = () => {
    return (foodstuffs, { req }): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (foodstuffs.length && foodstuffs.length > 0) {
                foodstuffs.forEachAsync((foodstuff) => {
                    if (
                        (!foodstuff.foodstuff || parseInt(foodstuff.foodstuff) === NaN) ||
                        (!foodstuff.amount || parseInt(foodstuff.amount) === NaN) ||
                        (!foodstuff.notes || typeof(foodstuff.notes)) !== 'string'
                    ) {
                        reject('Invalid foodstuff object');
                    }
                    checkIfFoodstuffExists(foodstuff.foodstuff).then((foodstuffExists) => {
                        if (!foodstuffExists) {
                            reject(`Foodstuff with id ${foodstuff.foodstuff} does not exist`);
                        }
                    });
                }).then(() => {
                    resolve(true);
                });
            } else {
                reject('Order foodstuff object is not a list of objects');
            }
        });
    }
}