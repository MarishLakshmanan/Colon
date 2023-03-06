import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  compilerModal = false
  @ViewChild('box') box:ElementRef

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
        this.box.nativeElement.scrollTo(0,this.box.nativeElement.scrollHeight)
        this.chats = (res);
      })
    })
  }

  sendMsg(type){
    let obj:Msg = {id:this.sender.id,msg:this.msg,time:new Date(),type:type}
    this.collections.add(obj).then((res)=>{
      this.msg = ''
    }).catch((e)=>{
      console.log(e);
    })
  }

  sendCode(){
    this.compilerModal = true
  }

  onCompile(event:Object|boolean){
    console.log(event);
    if(event==true){
      this.compilerModal=false
      return
    }
    let {code,type,value} = (<{code:string,type:string,value:string}>event)
    
    const encodedParams = new URLSearchParams();
    encodedParams.append("code", code);
    encodedParams.append("language", value);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedParams
    };

    this.msg = `${type} \n\n ${code}`
    this.sendMsg('code')
    fetch('https://api.codex.jaagrav.in', options)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        if(response.status==200)
          this.msg = response.output
        else
          this.msg = response.error
        this.sendMsg('code')
      })
      .catch(err => {
        this.msg = err.error
        this.sendMsg('code')
        console.log(err);
        
      });
    
      this.compilerModal=false
  }

  
  ngOnInit(){
    
  }

  ngOnDestroy(): void {
    // this.subscriber.unsubscribe()
    this.idSub.unsubscribe()
  }


}
