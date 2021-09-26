import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {
    io: any = undefined;

    constructor(private api: ApiClientService) {
        console.log("Testing io connection");
        this.io = io({
            auth: {
                token: "abc"
            }
        });

        this.io.on("connect_error", (err: Error) => {
            console.log(err.message); // prints the message associated with the error
        });
    }
}