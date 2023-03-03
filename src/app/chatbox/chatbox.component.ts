import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, Subscription } from 'rxjs';
import UserService, { User } from '../shared/user.service';
import { Msg } from '../shared/user.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})


export class ChatboxComponent implements OnInit,OnDestroy {
  collections:AngularFirestoreCollection
  listener:Observable<any>
  chats:Object[]
  idSub:Subscription
  subscriber:Subscription
  sender:User
  receiver:User
  available = false
  msg = ''
  today = new Date().toISOString().slice(0,10);

  sort(item1,item2){
    item1 = new Date(item1.time.seconds * 1000 + item1.time.nanoseconds / 1000000,);
    item2 = new Date(item2.time.seconds * 1000 + item2.time.nanoseconds / 1000000,);

    if(item1<item2){
      return -1
    }else if(item1>item2){
      return 1
    }else{
      return 0
    }
  }

  constructor(private afs:AngularFirestore,private userService:UserService){
    this.idSub = userService.passId.subscribe((res:{sender:string,receiver:string})=>{
      console.log(res);
      let roomID = Array.from((res.sender+res.receiver)).sort().join('')
      this.collections = afs.collection('Chats').doc(this.today).collection(roomID)
      this.listener = this.collections.valueChanges()
      this.receiver = userService.users[res.receiver]
      this.sender = JSON.parse(localStorage.getItem('user'))
      this.available = true


      this.subscriber = this.listener.pipe(map((value)=>{
        value.sort(this.sort)
        return value
      })).subscribe((res)=>{
        this.chats = (res);
      })
    })
  }

  sendMsg(){
    let obj:Msg = {id:this.sender.id,msg:this.msg,time:new Date()}
    this.collections.add(obj).then((res)=>{
      this.msg = ''
    }).catch((e)=>{
      console.log(e);
    })
  }

  sendCode(){
    const encodedParams = new URLSearchParams();
    encodedParams.append("code", this.msg);
    encodedParams.append("language", "js");

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedParams
    };

    fetch('https://api.codex.jaagrav.in', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }

  
  ngOnInit(){
    
  }

  ngOnDestroy(): void {
    // this.subscriber.unsubscribe()
    this.idSub.unsubscribe()
  }


}
