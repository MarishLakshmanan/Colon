import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core"
import { Subscription } from "rxjs";
import UserService from "../shared/user.service";

@Component({
    selector:"app-user",
    templateUrl:"./user.component.html",
    styleUrls:["./user.component.css"]
})
export default class UserComponent implements OnInit,OnDestroy{
    @Input() user:{id:string,name:String,profile:String};
    @Output() cb = new EventEmitter<any>()
    @Input() active:boolean
    selected:boolean = false
    subscriber:Subscription
    constructor(private userService:UserService){}

    ngOnInit(): void {
        this.subscriber = this.userService.passId.subscribe((res:{sender:string,receiver:string})=>{
            this.selected = res.receiver==this.user.id
        })
    }

    ngOnDestroy(): void {
        this.subscriber.unsubscribe()
    }

    onSelect(){
        this.cb.emit(this.user.id)
    }
}