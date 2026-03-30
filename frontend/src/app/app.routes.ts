import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { Client } from './pages/client/client';
import { StaffDashboardComponent } from './pages/staff-dashboard/staff-dashboard';
import { ListaPedidoComponent } from './pages/lista-pedido/lista-pedido';
import { ReceitasCategoriaComponent } from './pages/receitas-categorias/receitas-categorias';
import { CategoriaEquipamentoComponent } from './pages/categoria-equipamento/categoria-equipamento';
import { CrudFuncionarioComponent } from './pages/crud-funcionario/crud-funcionario';
import { EfetuarOrcamentoComponent } from './pages/efetuar-orcamento/efetuar-orcamento'

export const routes: Routes = [

    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'client', component: Client},
    {path: 'staff', component: StaffDashboardComponent},
    {path: 'funcionario/pedidos', component: ListaPedidoComponent },
    {path: 'receitas-categorias', component: ReceitasCategoriaComponent },
    {path: 'categorias', component: CategoriaEquipamentoComponent},
    {path: 'funcionarios', component: CrudFuncionarioComponent}, 
    {path: 'orcamento/:id', component: EfetuarOrcamentoComponent},
    
    {path: '', redirectTo: 'login', pathMatch: 'full'},
];
