import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {io, Socket} from "socket.io-client";


@Injectable({
    providedIn:"root"
})



export default class SockertService{
    private clientSocket: Socket
    constructor(){
        this.clientSocket = io('http://localhost:3000/')
    }

    listenToSocket(action){
        return new Observable((observer)=>{
            this.clientSocket.on(action,(data)=>{
                console.log("connected ",action);
                observer.next(data)
            })
        })
    }

    emitToSocket(action,data,room=0){
        this.clientSocket.emit(action,data,room)
    }
}