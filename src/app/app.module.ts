import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

// import { AlertModalComponent } from './shared/alert-modal/alert-modal.component';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

// import { LoaderComponent } from './shared/loader/loader.component';

import AppRouterModule from './router.module';
import AuthModule from './auth.module';
import MainModules from './main.module';
import UnknownComponent from './unknown/unknown.component';





@NgModule({
  declarations: [
    AppComponent,
    UnknownComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AuthModule,
    MainModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
