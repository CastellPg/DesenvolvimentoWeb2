import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Solicitacao {
  id: number;
  dataHora: string | Date;
  equipamento: string;
  categoria: string;
  estado: 'ABERTA' | 'ORÇADA' | 'APROVADA' | 'REJEITADA' | 'ARRUMADA' | 'PAGA';
  valor?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  nomeCliente: string = 'João Silva';

  //somente para teste de tela
  solicitacoes: Solicitacao[] = [
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
      equipamento: 'Impressora HP LaserJet Pro M402dn', // Nome longo para testar o limite de 30 chars
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
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // ordenação por data/hora crescente
    this.solicitacoes.sort((a, b) => {
      return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime();
    });
  }

  // função mudar o css baseado no estado do chamado, default é ABERTA
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
