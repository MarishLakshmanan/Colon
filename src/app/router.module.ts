import { NgModule } from "@angular/core";
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import UnknownComponent from "./unknown/unknown.component";


const routes : Routes = [
    {path:"",loadChildren:()=>import("./main.module").then((m)=>m)},
    {path:"auth",component:AuthComponent},
    {path:"**",component:UnknownComponent}
]

@NgModule({
    imports:[
        RouterModule.forRoot(routes)
    ],
    exports:[RouterModule]
})
export default class AppRouterModule{}