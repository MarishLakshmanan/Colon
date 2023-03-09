import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.css']
})
export class PickerComponent {
  primary = '#00194A';
  second = '#000A2E';
  third = '#1D295E';
  fourth = '#00072C';
  fifth =  '#002765';
  text=   '#fff';
  error =  'red'
  @Output() close = new EventEmitter()


  redesign(){
    localStorage.setItem("--primary",`${this.primary}`)
    localStorage.setItem("--second",`${this.second}`)
    localStorage.setItem("--third",`${this.third}`)
    localStorage.setItem("--fourth",`${this.fourth}`)
    localStorage.setItem("--fifth",`${this.fifth}`)
    localStorage.setItem("--text",`${this.text}`)
    localStorage.setItem("--error",`${this.error}`)
    this.close.emit(false)
  }

  onCancel(){
    this.close.emit(false)
  }

}
