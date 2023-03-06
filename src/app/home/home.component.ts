import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import BackendService from '../shared/backend.service';
import UserService, { User } from '../shared/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  collection:AngularFirestoreCollection<User>
  listener:Observable<User[]>
  users:User[] = []
  id:string
  subscriber:Subscription
  user:User


  constructor(private afs:AngularFirestore,private userService:UserService,private backend:BackendService,private router:Router){
    this.collection =this.afs.collection<User>('user')
    this.listener = this.collection.valueChanges();
    console.log(this.collection);
    this.user = JSON.parse(localStorage.getItem("user"))
  }

  ngOnInit(): void {
    this.subscriber = this.listener.subscribe((res)=>{
      let temp = {}
      res.forEach((item)=>{
        temp[item.id] = item
        if(item.id!=this.user.id)
          this.users.push(item)
      })
      this.userService.users = temp
    })
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe()
  }

  onSelect($event){
    this.id = $event + this.user.id
    this.userService.sendId(this.user.id,$event)
  }

  logout(){
    this.backend.logout()
    this.router.navigate(['/auth'])
  }
}
