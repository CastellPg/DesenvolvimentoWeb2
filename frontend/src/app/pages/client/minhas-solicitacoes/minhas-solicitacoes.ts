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
  historico?: any[];
}

@Component({
  selector: 'app-minhas-solicitacoes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './minhas-solicitacoes.html',
  styleUrls: ['./minhas-solicitacoes.css']
})
export class MinhasSolicitacoesComponent implements OnInit {

  todasSolicitacoes: Solicitacao[] = [];

  // ESTA É A LISTA QUE O SISTEMA VAI USAR PARA RECOMECAR
  private dadosIniciais: Solicitacao[] = [
    { id: 1, dataHora: '2026-03-20T14:30:00', equipamento: 'Notebook Dell Inspiron 15 3000', categoria: 'Informática', estado: 'ORÇADA', valor: 450.00, descricaoDefeito: 'Tela não liga.', historico: [{ dataHora: '2026-03-20T14:30:00', estadoNovo: 'ABERTA', descricao: 'Criada', funcionario: 'Sistema' }] },
    { id: 2, dataHora: '2026-03-22T09:15:00', equipamento: 'Impressora HP LaserJet Pro M402dn', categoria: 'Impressoras', estado: 'APROVADA', historico: [{ dataHora: '2026-03-22T09:15:00', estadoNovo: 'APROVADA', descricao: 'Aprovada', funcionario: 'Sistema' }] },
    { id: 3, dataHora: '2026-03-15T14:45:00', equipamento: 'Monitor LG UltraWide 29"', categoria: 'Monitores', estado: 'REJEITADA', historico: [{ dataHora: '2026-03-15T14:45:00', estadoNovo: 'REJEITADA', descricao: 'Rejeitada', funcionario: 'Sistema' }] },
    { id: 4, dataHora: '2026-03-26T10:00:00', equipamento: 'Smartphone Samsung Galaxy S21', categoria: 'Celulares', estado: 'ARRUMADA', valor: 650.00, historico: [{ dataHora: '2026-03-26T10:00:00', estadoNovo: 'ARRUMADA', descricao: 'Arrumada', funcionario: 'Sistema' }] },
    { id: 5, dataHora: '2026-03-28T08:30:00', equipamento: 'Tablet Apple iPad Air', categoria: 'Tablets', estado: 'ABERTA', historico: [{ dataHora: '2026-03-28T08:30:00', estadoNovo: 'ABERTA', descricao: 'Criada', funcionario: 'Sistema' }] },
    // --- NOVOS ITENS ADICIONADOS AQUI ---
    { id: 6, dataHora: '2026-04-01T10:00:00', equipamento: 'Console PlayStation 5', categoria: 'Games', estado: 'ORÇADA', valor: 350.00, descricaoDefeito: 'Superaquecimento.', historico: [{ dataHora: '2026-04-01T10:00:00', estadoNovo: 'ORÇADA', descricao: 'Aguardando aprovação', funcionario: 'Igor' }] },
    { id: 7, dataHora: '2026-04-03T09:20:00', equipamento: 'Smart TV Samsung 55" QLED', categoria: 'Televisores', estado: 'ORÇADA', valor: 1250.00, descricaoDefeito: 'Falha no LED.', historico: [{ dataHora: '2026-04-03T09:20:00', estadoNovo: 'ORÇADA', descricao: 'Aguardando aprovação', funcionario: 'Igor' }] },
    { id: 8, dataHora: '2026-04-05T14:00:00', equipamento: 'Console Nintendo Switch OLED', categoria: 'Games', estado: 'ORÇADA', valor: 280.00, descricaoDefeito: 'Drift no Joycon.', historico: [{ dataHora: '2026-04-05T14:00:00', estadoNovo: 'ORÇADA', descricao: 'Aguardando aprovação', funcionario: 'Igor' }] },
    { id: 9, dataHora: '2026-04-05T15:45:00', equipamento: 'Caixa de Som JBL Boombox 3', categoria: 'Áudio', estado: 'ORÇADA', valor: 520.00, descricaoDefeito: 'Não liga.', historico: [{ dataHora: '2026-04-05T15:45:00', estadoNovo: 'ORÇADA', descricao: 'Aguardando aprovação', funcionario: 'Igor' }] }
  ];

  constructor() {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    const dados = localStorage.getItem('banco_dados_v1');
    if (dados) {
      this.todasSolicitacoes = JSON.parse(dados);
    } else {
      localStorage.setItem('banco_dados_v1', JSON.stringify(this.dadosIniciais));
      this.todasSolicitacoes = this.dadosIniciais;
    }
    this.todasSolicitacoes.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
  }

  resetarSistema() {
    if (confirm('Deseja resetar a lista para os 9 itens iniciais?')) {
      localStorage.setItem('banco_dados_v1', JSON.stringify(this.dadosIniciais));
      this.carregarDados(); // Atualiza a tela na hora
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
