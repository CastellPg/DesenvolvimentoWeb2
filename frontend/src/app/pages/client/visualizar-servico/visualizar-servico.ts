import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

export interface Atualizacao {
  dataHora: string;
  funcionario: string;
  estadoAnterior: string;
  estadoNovo: string;
  descricao: string;
}

export interface SolicitacaoDetalhada {
  id: number;
  dataHora: string;
  equipamento: string;
  categoria: string;
  descricaoDefeito: string;
  estado: 'ABERTA' | 'ORÇADA' | 'APROVADA' | 'REJEITADA' | 'ARRUMADA' | 'PAGA';
  valor?: number;
  historico: Atualizacao[];
}

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './visualizar-servico.html',
  styleUrls: ['./visualizar-servico.css']
})
export class VisualizarServicoComponent implements OnInit {
  solicitacaoId!: number;
  solicitacao!: SolicitacaoDetalhada;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.solicitacaoId = Number(this.route.snapshot.paramMap.get('id'));

    // simulaçao da busca no Back-end pelo ID
    this.buscarDetalhesSolicitacao(this.solicitacaoId);
  }

  // simulação de requisição
  buscarDetalhesSolicitacao(id: number) {
    this.solicitacao = {
      id: id,
      dataHora: '2026-03-20T14:30:00',
      equipamento: 'Notebook Dell Inspiron 15 3000',
      categoria: 'Informática',
      descricaoDefeito: 'Tela não liga, provável problema no display ou cabo flat.',
      estado: 'ORÇADA',
      valor: 450.00,
      historico: [
        {
          dataHora: '2026-03-20T14:30:00',
          funcionario: 'Sistema',
          estadoAnterior: '',
          estadoNovo: 'ABERTA',
          descricao: 'Solicitação criada pelo cliente'
        },
        {
          dataHora: '2026-03-21T10:15:00',
          funcionario: 'Carlos Técnico',
          estadoAnterior: 'ABERTA',
          estadoNovo: 'ORÇADA',
          descricao: 'Orçamento apresentado após avaliação do display'
        }
      ]
    };
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'ORÇADA': return 'badge-orcada';
      case 'APROVADA': return 'badge-aprovada';
      case 'REJEITADA': return 'badge-rejeitada';
      case 'ARRUMADA': return 'badge-arrumada';
      case 'PAGA': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}
