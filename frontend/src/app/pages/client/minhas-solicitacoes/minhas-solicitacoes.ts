import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Solicitacao {
  id: number;
  dataHora: string;
  equipamento: string;
  categoria: string;
  estado: string;
  valor?: number;
}

@Component({
  selector: 'app-minhas-solicitacoes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './minhas-solicitacoes.html',
  styleUrls: ['./minhas-solicitacoes.css']
})
export class MinhasSolicitacoesComponent implements OnInit {
  // simulação de hidtorico
  todasSolicitacoes: Solicitacao[] = [
    {
      id: 1,
      dataHora: '2026-03-20T14:30:00',
      equipamento: 'Notebook Dell Inspiron 15 3000',
      categoria: 'Informática',
      estado: 'ORÇADA',
      valor: 450.00
    },
    {
      id: 2,
      dataHora: '2026-03-22T09:15:00',
      equipamento: 'Impressora HP LaserJet Pro M402dn',
      categoria: 'Impressoras',
      estado: 'APROVADA'
    },
    {
      id: 3,
      dataHora: '2026-03-15T14:45:00',
      equipamento: 'Monitor LG UltraWide 29"',
      categoria: 'Monitores',
      estado: 'REJEITADA'
    },
    {
      id: 4,
      dataHora: '2026-03-26T10:00:00',
      equipamento: 'Smartphone Samsung Galaxy S21',
      categoria: 'Celulares',
      estado: 'ARRUMADA',
      valor: 650.00
    },
    {
      id: 5,
      dataHora: '2026-03-28T08:30:00',
      equipamento: 'Tablet Apple iPad Air',
      categoria: 'Tablets',
      estado: 'ABERTA'
    },
    {
      id: 6,
      dataHora: '2026-02-10T11:20:00',
      equipamento: 'Placa de Vídeo RTX 3060',
      categoria: 'Informática',
      estado: 'PAGA',
      valor: 1800.00
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // ordem decrescente por data, a mais recente primeiro
    this.todasSolicitacoes.sort((a, b) => {
      return new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime();
    });
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
