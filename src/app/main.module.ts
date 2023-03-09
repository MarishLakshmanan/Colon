import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ChatComponent } from "./chatbox/chat/chat.component";
import { ChatboxComponent } from "./chatbox/chatbox.component";
import { CodeComponent } from "./chatbox/code/code.component";
import { HomeComponent } from "./home/home.component";
import UserComponent from "./user/user.component";
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { PickerComponent } from "./shared/picker/picker.component";
import { HighlightModule, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";



let routes:Routes = [
    {path:"",component:HomeComponent,pathMatch:"full",canActivate:[AngularFireAuthGuard],data:{authGuardPipe:()=>redirectUnauthorizedTo(['auth'])}}
]

@NgModule({
  declarations:[
    UserComponent,
    ChatboxComponent,
    ChatComponent,
    HomeComponent,
    CodeComponent,
    PickerComponent
  ],
  imports:[CommonModule,FormsModule,RouterModule.forChild(routes),HighlightModule],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
        themePath: '../assets/styles/solarized-dark.css',
      }
    }
  ],
  exports:[
    UserComponent,
    ChatboxComponent,
    ChatComponent,
    HomeComponent,
    CodeComponent
  ]
})
export default class MainModules{}