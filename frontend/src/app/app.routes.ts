import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { Client } from './pages/client/client';
export const routes: Routes = [

    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'client', component: Client},
    
    {path: '', redirectTo: 'login', pathMatch: 'full'},
];
