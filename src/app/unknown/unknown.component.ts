import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector:'app-unknown',
    templateUrl:'./unknown.component.html',
    styleUrls:["./unkown.component.css"]
})
export default class UnknownComponent{
    find = false
    start = false
    command = ''
    help = ['    *ls realms         *cd <realm name>']
    realms = ['    alfheim', '    asgard', '    vanaheim', '    jotunheim', '    nidavellir', '    svartalfheim', '    niffleheim', '    muspelheim', '    midgard' , '    heven']
    commands:string[] = ['> the page you are looking for is not in this realm try searching other realms do you want help ?']
    constructor(private router:Router){}
    check(event){
        
        if(event.key=="Enter"){
            if(this.command=="help"){
                this.commands = [...this.commands,...this.help]
            }else if(this.command=="ls realms"){
                this.commands.push('> ls realms')
                this.commands = [...this.commands,...this.realms]
            }else if(this.command.includes('cd')){
                this.commands.push(`> ${this.command}`)
                let realm = this.command.split('cd')[1].trim()
                this.commands.push('> let me check whether this is your realm')
                this.start = true
                setTimeout(()=>{
                    if(realm=='midgard'){
                        this.commands.push('> you found your home wait for the portal to open')
                        this.find = true
                        setTimeout(()=>{
                            this.router.navigate(['/'])
                        },4000)
                    }else{
                        this.commands.push("> sorry that's not your realm")
                        this.start = false
                    }
                },8000)
                
                
                
            }
            else{
                this.commands.push("    spell not found")
            }
            this.command=''
        }
        
    }
}