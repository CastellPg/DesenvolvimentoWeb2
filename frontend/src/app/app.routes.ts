import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { ClientComponent } from './pages/client/client';
import { StaffDashboardComponent } from './pages/staff-dashboard/staff-dashboard';
import { ListaPedidoComponent } from './pages/staff-dashboard/lista-pedido/lista-pedido';
import { ReceitasCategoriaComponent } from './pages/staff-dashboard/receitas-categorias/receitas-categorias';
import { CategoriaEquipamentoComponent } from './pages/staff-dashboard/categoria-equipamento/categoria-equipamento';
import { CrudFuncionarioComponent } from './pages/staff-dashboard/crud-funcionario/crud-funcionario';
import { EfetuarOrcamentoComponent } from './pages/staff-dashboard/efetuar-orcamento/efetuar-orcamento'
import { ReceitasComponent } from './pages/staff-dashboard/receitas/receitas';
import { EfetuarManutencaoComponent } from './pages/staff-dashboard/efetuar-manutencao/efetuar-manutencao';
import { FinalizarSolicitacaoComponent } from './pages/staff-dashboard/finalizar-solicitacao/finalizar-solicitacao';
import { RedirecionarManutencaoComponent } from './pages/staff-dashboard/redirecionar-manutencao/redirecionar-manutencao';

export const routes: Routes = [

    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'staff', component: StaffDashboardComponent},
    {path: 'funcionario/pedidos', component: ListaPedidoComponent },
    {path: 'receitas-categorias', component: ReceitasCategoriaComponent },
    {path: 'categorias', component: CategoriaEquipamentoComponent},
    {path: 'receitas', component: ReceitasComponent},
    {path: 'funcionarios', component: CrudFuncionarioComponent},
    {path: 'efetuar-orcamento/:id', component: EfetuarOrcamentoComponent },
    {path: 'efetuar-manutencao/:id', component: EfetuarManutencaoComponent },
    {path: 'finalizar-solicitacao/:id', component: FinalizarSolicitacaoComponent },
    {path: 'solicitacoes', component: ListaPedidoComponent },
    {path: 'redirecionar-manutencao/:id', component: RedirecionarManutencaoComponent },
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
