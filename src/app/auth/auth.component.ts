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
// https://cdn-icons-png.flaticon.com/512/4333/4333609.png
export class AuthComponent {
  signup = true
  src: String|ArrayBuffer = "../../assets/pika.jpg"
  msg = ""
  color = "red"
  alert =false
  img = "" 
  loading = false
  @ViewChild('procon') profile

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

  makeit3d(event){
    
    document.querySelectorAll('.planet').forEach((element:HTMLElement)=>{
      let x =(event.clientX);
      let y= (event.clientY);
      let move =  parseInt(element.getAttribute('data-value'))
      
      x = (x*move)/350
      y = (y*move)/350
      
      element.style.transform = `translateX(${x}%) translateY(${y}%)`
    });


    


    let eye:any = document.querySelector('.profile')

    if(this.src!="../../assets/pika.jpg"){
      eye.style.setProperty('--top','1200px')  
      return
    }

    let cord = eye.getBoundingClientRect()
    let x = cord.left + cord.width / 2
    let y = cord.top + cord.height / 2 
    let deg = this.angle(event.clientX,event.clientY,x,y)
    // console.log(deg);
    
    if(deg>0 && deg>90){
      let left = deg/11
      let top = deg/11
      // console.log(deg,top);
      
      eye.style.setProperty('--left',`${(127)+left}px`)
      eye.style.setProperty('--right',`${(139)-left}px`)
      eye.style.setProperty('--top',`${(100)+top}px`)

    }else if(deg>0 && deg<90){
      let right = deg/11
      let top = deg/5
      // console.log(116-top);
      if(116-top<109){
        top = 7
      }
      
      eye.style.setProperty('--left',`${(127)+right}px`)
      eye.style.setProperty('--right',`${(139)-right}px`)
      eye.style.setProperty('--top',`${(116)-top}px`)
      
    }else if(deg<0 && deg<(-90)){
      let right = (-deg)/11
      let top = ((-deg)/11)-11
      // console.log(top);
      
      eye.style.setProperty('--left',`${(127)+right}px`)
      eye.style.setProperty('--right',`${(139)-right}px`)
      eye.style.setProperty('--top',`${(120)-top}px`)
      
    }else if(deg<0 && deg>(-90)){
      let right = (-deg)/11
      let top = ((-deg)/11)
      // console.log(top);
      eye.style.setProperty('--left',`${(127)+right}px`)
      eye.style.setProperty('--right',`${(139)-right}px`)
      eye.style.setProperty('--top',`${(116)+top}px`)
    }

    
  }
  
  private angle = (cx,cy,ex,ey) => {
    let dx = ex-cx
    let dy = ey-cy
    let deg = Math.atan2(dy,dx)
    deg = deg * 180 / Math.PI
    return deg
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
        console.log(this.profile);
        this.profile.nativeElement.classList.toggle('shake')
        setTimeout(()=>{
          this.profile.nativeElement.classList.toggle('shake')
        },1500)
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
        res.subscribe((res)=>{
          console.log(res.data());
          localStorage.setItem("user",JSON.stringify(res.data()))  
          this.loading=false;
          this.router.navigate(['/'])
        })            
        
      }).catch((e)=>{
        this.triggerAlert(e.slice(5),"red")
        this.loading=false
      })
    }
  }
}

