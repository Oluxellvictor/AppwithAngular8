import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {path: "home", component: HomeComponent},
    {path: '', component: HomeComponent,pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo:'/home'}
    
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 