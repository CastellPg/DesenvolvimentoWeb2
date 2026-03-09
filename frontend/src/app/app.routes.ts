import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home';
import{LoginComponent} from './pages/login/login';
import{RegistroComponent} from './pages/registro/registro';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    
    {path: '', redirectTo: 'home', pathMatch: 'full'},
];
