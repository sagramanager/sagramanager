import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import io from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {
    io: any = undefined;

    public foodstuffTypes: any = [];
    public foodstuffTypesLoad = new Subject();
    public foodstuffTypesLoaded = false;

    public foodstuffs: any = [];
    public foodstuffsLoad = new Subject();
    public foodstuffsLoaded = false;

    public foodstuffsListByTypes: any = [];

    public waiters: any = [];
    public waitersLoad = new Subject();
    public waitersLoaded = false;

    public orders: any = [];
    public ordersLoad = new Subject();
    public ordersLoaded = false;

    constructor(private api: ApiClientService) {}

    public initialize(token: string) {
        this.api.setToken(token);

        this.io = io({
            auth: {
                token: token
            }
        });

        this.io.on("connection", (socket: any) => {
            console.log("Socket connected", socket.id);
        });
        this.io.on("connect_error", (err: Error) => {
            console.error("Websocket connection error", err);
        });

        this.io.on("newFoodstuffType", (data: any) => {
            console.log("newFoodstuffType", data);
            this.foodstuffTypes.push(data);
        });
        this.io.on("newFoodstuff", (data: any) => {
            console.log("newFoodstuff", data);
            this.foodstuffs.push(data);
            if(typeof(this.foodstuffsListByTypes[data.type.name]) === "undefined") {
                this.foodstuffsListByTypes[data.type.name] = [];
            }
            this.foodstuffsListByTypes[data.type.name].push(data);
        });
        this.io.on("newWaiter", (data: any) => {
            console.log("newWaiter", data);
            this.waiters.push(data);
        });
        this.io.on("newOrder", (data: any) => {
            console.log("newOrder", data);
            this.orders.push(data);
        });
    }

    loadFoodstuffData() {
        this.api.get("foodstuffTypes").then((res) => {
            console.log(res);
            this.foodstuffTypes = res;
            this.foodstuffTypesLoad.next();
            this.foodstuffTypesLoaded = true;
        });
        this.api.get("foodstuffs").then((res) => {
            console.log(res);
            this.foodstuffsListByTypes = [];
            res.forEach((foodstuff: any) => {
                if(typeof(this.foodstuffsListByTypes[foodstuff.type.name]) === "undefined") {
                    this.foodstuffsListByTypes[foodstuff.type.name] = [];
                }
                this.foodstuffsListByTypes[foodstuff.type.name].push(foodstuff);
            });
            console.log(this.foodstuffsListByTypes);
            this.foodstuffs = res;
            this.foodstuffsLoad.next();
            this.foodstuffsLoaded = true;
        });
    }

    loadWaiters() {
        this.api.get("waiters").then((res) => {
            console.log(res);
            this.waiters = res;
            this.waitersLoad.next();
            this.waitersLoaded = true;
        });
    }

    loadOrders() {
        this.api.get("orders").then((res) => {
            console.log(res);
            this.orders = res;
            this.ordersLoad.next();
            this.ordersLoaded = true;
        });
    }

    getFoodstuffIdByName(foodstuffName: string) {
        for(let foodstuff of this.foodstuffs) {
          if(foodstuff.name == foodstuffName) return foodstuff.id;
        }
    }

    getFoodstuffsByType(foodstuffType: string) {
        return this.foodstuffsListByTypes[foodstuffType];
    }

    getFoodstuffById(foodstuffId: number) {
        return this.foodstuffs.find((foodstuff: any) => foodstuff.id == foodstuffId);
    }

    getWaiterNameById(waiterId: number) {
        return this.waiters.find((waiter: any) => waiter.id == waiterId).name;
    }
}