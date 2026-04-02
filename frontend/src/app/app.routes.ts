import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { ClientComponent } from './pages/client/client';
import { StaffDashboardComponent } from './pages/staff-dashboard/staff-dashboard';
import { ListaPedidoComponent } from './pages/lista-pedido/lista-pedido';
import { ReceitasCategoriaComponent } from './pages/receitas-categorias/receitas-categorias';
import { CategoriaEquipamentoComponent } from './pages/categoria-equipamento/categoria-equipamento';
import { CrudFuncionarioComponent } from './pages/crud-funcionario/crud-funcionario';
import { EfetuarOrcamentoComponent } from './pages/efetuar-orcamento/efetuar-orcamento'
import { ReceitasComponent } from './pages/receitas/receitas';

export const routes: Routes = [

    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'client', component: ClientComponent},
    {path: 'staff', component: StaffDashboardComponent},
    {path: 'funcionario/pedidos', component: ListaPedidoComponent },
    {path: 'receitas-categorias', component: ReceitasCategoriaComponent },
    {path: 'categorias', component: CategoriaEquipamentoComponent},
    {path: 'receitas', component: ReceitasComponent},
    {path: 'funcionarios', component: CrudFuncionarioComponent},
    {
        path: 'client',
        component: ClientComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/client/dashboard/dashboard').then(m => m.DashboardComponent)
            },
            {
                path: 'nova-solicitacao',
                loadComponent: () => import('./pages/client/nova-solicitacao/nova-solicitacao').then(m => m.NovaSolicitacaoComponent)
            },
            {
                path: 'minhas-solicitacoes',
                loadComponent: () => import('./pages/client/minhas-solicitacoes/minhas-solicitacoes').then(m => m.MinhasSolicitacoesComponent)
            },
            {
                path: 'visualizar/:id',
                loadComponent: () => import('./pages/client/visualizar-servico/visualizar-servico').then(m => m.VisualizarServicoComponent)
            },
            {
                path: 'orcamento/:id',
                loadComponent: () => import('./pages/client/orcamento/orcamento').then(m => m.OrcamentoComponent)
            },
            {
                path: 'pagamento/:id',
                loadComponent: () => import('./pages/client/pagamento/pagamento').then(m => m.PagamentoComponent)
            }
        ]
    },

    {path: 'funcionarios', component: CrudFuncionarioComponent},
    {path: 'orcamento/:id', component: EfetuarOrcamentoComponent},

    {path: '', redirectTo: 'login', pathMatch: 'full'},
];
