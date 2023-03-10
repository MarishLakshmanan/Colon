import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, Subscription } from 'rxjs';
import UserService, { User } from '../shared/user.service';
import { Msg } from '../shared/user.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})




export class ChatboxComponent implements OnDestroy {
  collections:AngularFirestoreCollection
  listener:Observable<any>
  chats:Object[]
  idSub:Subscription
  subscriber:Subscription
  sender:User
  receiver:User
  available = false
  msg = ''
  output = ''
  showOutput = false
  today = new Date().getFullYear().toString()
  compilerModal = false
  loading = false
  @ViewChild('box') box:ElementRef
  @Output() back = new EventEmitter<boolean>()
  public getScreenWidth: any;
  public getScreenHeight: any;

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

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }


  constructor(private afs:AngularFirestore,private userService:UserService){
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.idSub = userService.passId.subscribe((res:{sender:string,receiver:string})=>{
      
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

    if(this.msg==""){
      return
    }

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
    if(event==true){
      this.compilerModal=false
      return
    }
    let {code,type,value} = (<{code:string,type:string,value:string}>event)
    if(code==''){
      return
    }

    this.msg = `type: ${type} \n\n ${code}`
    this.sendMsg('code')
    this.compilerModal=false
  }


  onCompile2(event:Object){
    let {code,type,value} = (<{code:string,type:string,value:string}>event)
    this.loading = true
    code = code.trim()
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
    
    fetch('https://api.codex.jaagrav.in', options)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.showOutput = true
        if(response.error=='')
          this.output = response.output
        else
          this.output = response.error
        this.loading = false
      })
      .catch(err => {
        console.log(err);
        this.output = err
        this.loading = false
      });
  }
  


  onPress(event){
    if(event.key=="Enter"){
      this.sendMsg("txt")
    }
  }

  ngOnDestroy(): void {
    // this.subscriber.unsubscribe()
    this.idSub.unsubscribe()
  }

  toggle(){
    this.back.emit(true)
  }


}
