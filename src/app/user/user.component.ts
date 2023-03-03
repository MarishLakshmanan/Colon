import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core"

@Component({
    selector:"app-user",
    templateUrl:"./user.component.html",
    styleUrls:["./user.component.css"]
})
export default class UserComponent implements OnInit{
    @Input() user:{id:number,name:String,profile:String};
    @Output() cb = new EventEmitter<any>()

    ngOnInit(): void {
        
    }

    onSelect(){
        this.cb.emit(this.user.id)
    }
}