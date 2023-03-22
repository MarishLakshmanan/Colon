import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @Input() msg;
  pattern:RegExp = /type:.(Python|Java|C\+\+|C|GoLang|C#|NodeJs)/
  @Output() pass = new EventEmitter()

  compile(){
    let match = (this.pattern.exec(this.msg.msg));
    let code  = this.msg.msg.split(match[0])[1]
    let type = match[1]
    let extension = 'py'
    switch(type){
      case "Java":
        extension = 'java'
        break
      case "C++":
        extension = 'cpp'
        break
      case "C":
        extension = 'c'
        break
      case "GoLang":
        extension = 'go'
        break
      case "C#":
        extension = 'cs'
        break
      case "NodeJs":
        extension = 'js'
        break
    }

  // this.onCompile({code:code,type:type,value:extension})
  this.pass.emit({code:code,type:type,value:extension})
  }

  onCompile(event:Object){
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

    fetch('https://api.codex.jaagrav.in', options)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        
      })
      .catch(err => {
        console.log(err);
        
      });
  }

}
