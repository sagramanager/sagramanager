import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import io from 'socket.io-client';
import { AsyncSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {
    io: any = undefined;

    public foodstuffTypes: any = [];
    public foodstuffTypesLoad = new AsyncSubject();
    public foodstuffTypesLoaded = false;

    public foodstuffs: any = [];
    public foodstuffsLoad = new AsyncSubject();
    public foodstuffsLoaded = false;

    public foodstuffsListByTypes: any = [];

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

        this.api.get("foodstuffTypes").then((res) => {
            console.log(res);
            this.foodstuffTypes = res;
            this.foodstuffTypesLoad.complete();
            this.foodstuffTypesLoaded = true;
        });
        this.api.get("foodstuffs").then((res) => {
            console.log(res);
            res.forEach((foodstuff: any) => {
              if(typeof(this.foodstuffsListByTypes[foodstuff.type.name]) === "undefined") {
                this.foodstuffsListByTypes[foodstuff.type.name] = [];
              }
              this.foodstuffsListByTypes[foodstuff.type.name].push(foodstuff);
            });
            console.log(this.foodstuffsListByTypes);
            this.foodstuffs = res;
            this.foodstuffsLoad.complete();
            this.foodstuffsLoaded = true;
        });
    }

    getFoodstuffIdByName(foodstuffName: string) {
        for(let foodstuff of this.foodstuffs) {
          if(foodstuff.name == foodstuffName) return foodstuff.id;
        }
    }
}