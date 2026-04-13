import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../services/solicitacao.service';

export interface Solicitacao {
  id: number;
  dataHora: string | Date;
  equipamento: string;
  categoria: string;
  estado: string;
  valor?: number;
  descricaoDefeito?: string;
  motivoRejeicao?: string;
  historico?: any[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  nomeCliente: string | null = null;
  solicitacoes: Solicitacao[] = [];

  private solicitacaoService = inject(SolicitacaoService);

  ngOnInit(): void {
    // Lê o nome do usuário logado 
    this.nomeCliente = localStorage.getItem('nomeUsuario');
    this.carregarSistema();
  }

  carregarSistema(): void {
    //Dado pronto só pq ainda n tem dados no BD
    const clienteIdLogado = 1;

    this.solicitacaoService.listarPorCliente(clienteIdLogado).subscribe({
      next: (dadosRetornadosDoBanco) => {
        console.log('DADOS QUE CHEGARAM DO BANCO:', dadosRetornadosDoBanco);
        this.solicitacoes = dadosRetornadosDoBanco;
      },
      error: (erro) => {
        console.error('Erro ao buscar do backend', erro);
        alert('Não foi possivel carregar as solicitações. O backend está rodando?');
      }
    });
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'ABERTA': return 'bg-secondary';
      case 'ORCADA': return 'bg-marrom';
      case 'REJEITADA': return 'bg-danger';
      case 'APROVADA': return 'bg-warning text-dark';
      case 'REDIRECIONADA': return 'bg-roxo';
      case 'ARRUMADA': return 'bg-primary';
      case 'PAGA': return 'bg-laranja';
      case 'FINALIZADA': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}
