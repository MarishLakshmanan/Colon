import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import BackendService from '../shared/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  signup = true
  src: String|ArrayBuffer = "https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
  msg = ""
  color = "red"
  alert =false
  img = "" 
  loading = false

  constructor(private storage:AngularFireStorage,private backend:BackendService,private router:Router){}

  changeMode(){
    this.signup=!this.signup
  }

  chooseProfile(e){
    let fr = new FileReader()
    fr.readAsDataURL(e.target.files[0])
    this.img = e.target.files[0]
    fr.onloadend=(e)=>{
      this.src = e.target.result;
    }
  }
  
  triggerAlert(msg,color){
    this.alert =true
      this.msg = msg
      this.color = color
      setTimeout(()=>{this.alert=false},5000)
      return 
  }


  onSubmit(form:NgForm){
    if(this.signup==true){
      if(form.value.name==""||form.value.name==null){
        this.triggerAlert("Please enter your name","red")
        this.loading=false;
        return
      }
      if(this.img==""||this.img==null){
        this.triggerAlert("Please upload your profile","red")
        this.loading=false;
        return
      }
    }
    if(form.valid==false){
    this.triggerAlert("Please enter email-id and password","red")
    return
    }
    this.loading= true
    if(this.signup==true){
      this.backend.signUp(this.img,form).then((res)=>{
        console.log(res);
        this.loading=false;
        this.router.navigate(['/'])
      }).catch((e)=>{
        this.triggerAlert((<string>e).slice(5),"red")
        this.loading=false
      })
    }else{
      this.backend.login(form.value.email,form.value.pass).then((res)=>{
        console.log(res);
        this.loading=false;
        this.router.navigate(['/'])
      }).catch((e)=>{
        this.triggerAlert(e.slice(5),"red")
        this.loading=false
      })
    }
  }
}

