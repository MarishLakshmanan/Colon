import { Component, EventEmitter, Input,Output } from '@angular/core';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent {
  code =''
  lang = "py"
  selectedLang = "Python"
  langB = false
  @Output() compile = new EventEmitter<Object|boolean>()

  onCancel(){
    this.compile.emit(true)
  }

  onCompile(){
    this.compile.emit({code:this.code,value:this.lang,type:this.selectedLang})
  }

  onSelect(l,sl){
    this.lang = l
    this.selectedLang = sl 
    this.langB = false
  }

  toggle(){
    this.langB = !this.langB
  }
}
