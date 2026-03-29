import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { Client } from './pages/client/client';
import { StaffDashboardComponent } from './pages/staff-dashboard/staff-dashboard';
import { ListaPedidoComponent } from './pages/lista-pedido/lista-pedido';
import { CategoriaEquipamentoComponent } from './pages/categoria-equipamento/categoria-equipamento';
export const routes: Routes = [

    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'client', component: Client},
    {path: 'staff-Dashboard', component: StaffDashboardComponent},
    {path: 'funcionario/pedidos', component: ListaPedidoComponent },
    {path: 'categorias', component: CategoriaEquipamentoComponent}, 
    
    {path: '', redirectTo: 'login', pathMatch: 'full'},
];
