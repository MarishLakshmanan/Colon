import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { RouterModule, Routes } from '@angular/router';
import UserComponent from './user/user.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { ChatComponent } from './chatbox/chat/chat.component';
import { HomeComponent } from './home/home.component';
import { AlertModalComponent } from './shared/alert-modal/alert-modal.component';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { LoaderComponent } from './shared/loader/loader.component';
import { CodeComponent } from './chatbox/code/code.component';



const routes : Routes = [
  {path:"",component:HomeComponent,pathMatch:"full",canActivate:[AngularFireAuthGuard],data:{authGuardPipe:()=>redirectUnauthorizedTo(['auth'])}},
  {path:"auth",component:AuthComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    UserComponent,
    ChatboxComponent,
    ChatComponent,
    HomeComponent,
    AlertModalComponent,
    LoaderComponent,
    CodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
