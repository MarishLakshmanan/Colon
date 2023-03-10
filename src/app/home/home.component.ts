import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { every, Observable, Subscription } from 'rxjs';
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
  toggle = true
  public getScreenWidth: any;
  public getScreenHeight: any;
  option = false
  picker = false
  

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }


  constructor(private afs:AngularFirestore,private userService:UserService,private backend:BackendService,private router:Router){
    this.collection =this.afs.collection<User>('user')
    this.listener = this.collection.valueChanges();
    console.log(this.collection);
    this.user = JSON.parse(localStorage.getItem("user"))
  }

  redesign(){
    document.getElementsByTagName('body')[0].style.setProperty("--primary",localStorage.getItem("--primary"))
    document.getElementsByTagName('body')[0].style.setProperty("--second",localStorage.getItem("--second"))
    document.getElementsByTagName('body')[0].style.setProperty("--third",localStorage.getItem("--third"))
    document.getElementsByTagName('body')[0].style.setProperty("--fourth",localStorage.getItem("--fourth"))
    document.getElementsByTagName('body')[0].style.setProperty("--fifth",localStorage.getItem("--fifth"))
    document.getElementsByTagName('body')[0].style.setProperty("--text",localStorage.getItem("--text"))
    document.getElementsByTagName('body')[0].style.setProperty("--error",localStorage.getItem("--error"))
  }

  ngOnInit(): void {
    this.redesign()
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.subscriber = this.listener.subscribe((res)=>{
      let temp = {}
      this.users =[]
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

  toggleMode(){
    this.toggle = !this.toggle
  }

  onToggle(){
    this.option=!this.option
  }
  logout(){
    // this.option=true
    this.backend.logout()
    this.router.navigate(['/auth'])
  }

  toggleTheme(){
    this.picker=true
    this.onToggle()
  }
  closeTheme(event){
    // console.log(event);
    
    this.picker=event
    this.redesign()
  }
  
}
