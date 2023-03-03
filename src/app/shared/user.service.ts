import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface User{
    name:String,
    profile:String,
    id:string,
    email:String
}

export interface Msg{
    msg:string,
    id:string,
    time:Date
}

@Injectable({
    providedIn:"root"
})
export default class UserService{
    users
    passId = new Subject()

    sendId(sender:string,receiver:string){
        this.passId.next({sender,receiver})
    }
}