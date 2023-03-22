import { Directive, ElementRef, HostListener, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
    selector:"[parallel]"
})
export default class ParallelDirective{
    
    constructor(private elementRef:ElementRef){}

    @HostListener('mouseover',['$event']) mouseover(event){
        let planets = (this.elementRef.nativeElement.children[1].children);
        
        Array.from(planets).forEach((element:HTMLElement)=>{
            let x =(event.clientX);
            let y= (event.clientY);
            let move =  parseInt(element.getAttribute('data-value'))
            
            x = (x*move)/350
            y = (y*move)/350
            
            element.style.transform = `translateX(${x}%) translateY(${y}%)`
        });
        
        let eye = this.elementRef.nativeElement.children[0].children[0].children[1].children[0]
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
        
    
        
    }
      
    private angle = (cx,cy,ex,ey) => {
    let dx = ex-cx
    let dy = ey-cy
    let deg = Math.atan2(dy,dx)
    deg = deg * 180 / Math.PI
    return deg
    }
    
}