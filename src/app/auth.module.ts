import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthComponent } from './auth/auth.component';
import ParallelDirective from "./auth/parallel.directive";
import { AlertModalComponent } from "./shared/alert-modal/alert-modal.component";
import { LoaderComponent } from "./shared/loader/loader.component";

@NgModule({
    declarations:[AuthComponent,LoaderComponent,AlertModalComponent,ParallelDirective],
    imports:[CommonModule,FormsModule],
    exports:[AuthComponent]
})
export default class AuthModule{}