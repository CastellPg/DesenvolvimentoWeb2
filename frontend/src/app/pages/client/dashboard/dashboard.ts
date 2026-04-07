import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  private dadosIniciais: Solicitacao[] = [
    {
      id: 1,
      dataHora: '2026-03-20T14:30:00',
      equipamento: 'Notebook Dell Inspiron 15 3000',
      categoria: 'Informática',
      estado: 'ORÇADA',
      valor: 450.00,
      descricaoDefeito: 'Tela não liga.',
      historico: [{ dataHora: '2026-03-20T14:30:00', estadoNovo: 'ABERTA', descricao: 'Criada', funcionario: 'Sistema' }]
    },
    {
      id: 2,
      dataHora: '2026-03-22T09:15:00',
      equipamento: 'Impressora HP LaserJet Pro M402dn',
      categoria: 'Impressoras',
      estado: 'APROVADA',
      historico: [{ dataHora: '2026-03-22T09:15:00', estadoNovo: 'APROVADA', descricao: 'Aprovada', funcionario: 'Sistema' }]
    },
    {
      id: 3,
      dataHora: '2026-03-15T14:45:00',
      equipamento: 'Monitor LG UltraWide 29"',
      categoria: 'Monitores',
      estado: 'REJEITADA',
      valor: 800.00,
      descricaoDefeito: 'Sem imagem, LED acende mas tela permanece preta',
      motivoRejeicao: 'Valor muito alto para o equipamento',
      historico: [
        { dataHora: '2026-03-15T14:45:00', estadoNovo: 'ABERTA', descricao: 'Solicitação criada', funcionario: 'Cliente registrou solicitação de manutenção' },
        { dataHora: '2026-03-26T09:00', estadoNovo: 'ORÇADA', descricao: 'Orçamento apresentado', funcionario: 'Pedro Silva', valor: 'R$ 800,00' },
        { dataHora: '2026-03-26T14:30', estadoNovo: 'REJEITADA', descricao: 'Serviço rejeitado', funcionario: 'Motivo: Valor muito alto para o equipamento' }
      ]
    },
    {
      id: 4,
      dataHora: '2026-03-26T10:00:00',
      equipamento: 'Smartphone Samsung Galaxy S21',
      categoria: 'Celulares',
      estado: 'ARRUMADA',
      valor: 650.00,
      historico: [{ dataHora: '2026-03-26T10:00:00', estadoNovo: 'ARRUMADA', descricao: 'Arrumada', funcionario: 'Sistema' }]
    },
    {
      id: 5,
      dataHora: '2026-03-28T08:30:00',
      equipamento: 'Tablet Apple iPad Air',
      categoria: 'Tablets',
      estado: 'ABERTA',
      historico: [{ dataHora: '2026-03-28T08:30:00', estadoNovo: 'ABERTA', descricao: 'Criada', funcionario: 'Sistema' }]
    },
    {
      id: 6,
      dataHora: '2026-04-01T10:00:00',
      equipamento: 'Console PlayStation 5',
      categoria: 'Games',
      estado: 'ORÇADA',
      valor: 350.00,
      descricaoDefeito: 'Superaquecimento e desligamento repentino.',
      historico: [{ dataHora: '2026-04-01T10:00:00', estadoNovo: 'ORÇADA', descricao: 'Aguardando aprovação do cliente', funcionario: 'Técnico Igor' }]
    },
    {
      id: 7,
      dataHora: '2026-04-03T09:20:00',
      equipamento: 'Smart TV Samsung 55" QLED',
      categoria: 'Televisores',
      estado: 'ORÇADA',
      valor: 1250.00,
      descricaoDefeito: 'Falha no barramento de LED.',
      historico: [{ dataHora: '2026-04-03T09:20:00', estadoNovo: 'ORÇADA', descricao: 'Aguardando aprovação do cliente', funcionario: 'Técnico Igor' }]
    },
    {
      id: 8,
      dataHora: '2026-04-05T14:00:00',
      equipamento: 'Console Nintendo Switch OLED',
      categoria: 'Games',
      estado: 'ORÇADA',
      valor: 280.00,
      descricaoDefeito: 'Joy-cons com drift e conector de carga ruim.',
      historico: [{ dataHora: '2026-04-05T14:00:00', estadoNovo: 'ORÇADA', descricao: 'Aguardando aprovação do cliente', funcionario: 'Técnico Igor' }]
    },
    {
      id: 9,
      dataHora: '2026-04-05T15:45:00',
      equipamento: 'Caixa de Som JBL Boombox 3',
      categoria: 'Áudio',
      estado: 'ORÇADA',
      valor: 520.00,
      descricaoDefeito: 'Não liga e não carrega a bateria.',
      historico: [{ dataHora: '2026-04-05T15:45:00', estadoNovo: 'ORÇADA', descricao: 'Aguardando aprovação do cliente', funcionario: 'Técnico Igor' }]
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Lê o nome do usuário logado do localStorage 
    this.nomeCliente = localStorage.getItem('nomeUsuario');
    this.carregarSistema();
  }

  carregarSistema(): void {
    const dadosSalvos = localStorage.getItem('banco_dados_v1');

    if (dadosSalvos) {
      this.solicitacoes = JSON.parse(dadosSalvos);
    } else {
      localStorage.setItem('banco_dados_v1', JSON.stringify(this.dadosIniciais));
      this.solicitacoes = this.dadosIniciais;
    }

    this.solicitacoes.sort((a, b) => {
      return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime();
    });
  }

  resetarSistema() {
    if (confirm('Isso vai apagar as suas criações e voltar para os 9 itens iniciais (incluindo os novos orçados). Continuar?')) {
      
      localStorage.removeItem('banco_dados_v1');
      
      const dadosLimpos = JSON.parse(JSON.stringify(this.dadosIniciais));
      localStorage.setItem('banco_dados_v1', JSON.stringify(dadosLimpos));
      
      this.carregarSistema();
      location.reload();
    }
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'ABERTA': return 'bg-secondary';
      case 'ORÇADA': return 'bg-marrom';
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
