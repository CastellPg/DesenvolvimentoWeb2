import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type StatusSolicitacao =
  | 'PAGA'
  | 'APROVADA'
  | 'EM MANUTENÇÃO'
  | 'ORÇADA'
  | 'REDIRECIONADA'
  | 'FINALIZADA';

interface Solicitacao {
  id: number;
  status: StatusSolicitacao;
  data: string;
  cliente: string;
  categoria: string;
  produto: string;
  problema: string;
  acao: string;
}

@Component({
  selector: 'app-lista-pedido',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-pedido.html',
  styleUrl: './lista-pedido.css',
})
export class ListaPedidoComponent {
  filtroSelecionado = 'todas';

  solicitacoes: Solicitacao[] = [
    {
      id: 5,
      status: 'PAGA',
      data: '20/03/2026, 09:00',
      cliente: 'Maria Santos',
      categoria: 'Microfone',
      produto: 'Blue Yeti USB Microphone',
      problema: 'Microfone não capta áudio',
      acao: 'Finalizar Solicitação'
    },
    {
      id: 4,
      status: 'APROVADA',
      data: '21/03/2026, 11:00',
      cliente: 'João Silva',
      categoria: 'Notebook',
      produto: 'Samsung Galaxy Book',
      problema: 'Tela com manchas escuras',
      acao: 'Efetuar Manutenção'
    },
    {
      id: 3,
      status: 'ORÇADA',
      data: '22/03/2026, 14:30',
      cliente: 'Pedro Lima',
      categoria: 'Impressora',
      produto: 'HP LaserJet Pro',
      problema: 'Não imprime em preto',
      acao: 'Aguardando Aprovação'
    },
    {
      id: 2,
      status: 'REDIRECIONADA',
      data: '23/03/2026, 16:10',
      cliente: 'Ana Souza',
      categoria: 'Monitor',
      produto: 'LG UltraWide 29"',
      problema: 'Tela piscando constantemente',
      acao: 'Ver Detalhes'
    }
  ];

  get solicitacoesFiltradas(): Solicitacao[] {
    if (this.filtroSelecionado === 'todas') {
      return this.solicitacoes;
    }

    return this.solicitacoes.filter(
      s => s.status.toLowerCase() === this.filtroSelecionado.toLowerCase()
    );
  }

  executarAcao(solicitacao: Solicitacao) {
    if (solicitacao.status === 'PAGA') {
      solicitacao.status = 'FINALIZADA';
      solicitacao.acao = 'Concluída';
      alert(`Solicitação #${solicitacao.id} finalizada com sucesso!`);
      return;
    }

    if (solicitacao.status === 'APROVADA') {
      solicitacao.status = 'EM MANUTENÇÃO';
      solicitacao.acao = 'Finalizar Serviço';
      alert(`Manutenção iniciada na solicitação #${solicitacao.id}!`);
      return;
    }

    if (solicitacao.status === 'EM MANUTENÇÃO') {
      solicitacao.status = 'FINALIZADA';
      solicitacao.acao = 'Concluída';
      alert(`Solicitação #${solicitacao.id} finalizada com sucesso!`);
      return;
    }

    if (solicitacao.status === 'REDIRECIONADA') {
      alert(
        `Detalhes da solicitação #${solicitacao.id}\n\n` +
        `Cliente: ${solicitacao.cliente}\n` +
        `Categoria: ${solicitacao.categoria}\n` +
        `Produto: ${solicitacao.produto}\n` +
        `Problema: ${solicitacao.problema}\n` +
        `Status: ${solicitacao.status}`
      );
    }
  }

  mostrarBotaoAcao(solicitacao: Solicitacao): boolean {
    return solicitacao.status !== 'ORÇADA' && solicitacao.status !== 'FINALIZADA';
  }

  getClasseCard(status: StatusSolicitacao): string {
    switch (status) {
      case 'PAGA':
        return 'os-card-paga';
      case 'APROVADA':
        return 'os-card-aprovada';
      case 'EM MANUTENÇÃO':
        return 'os-card-manutencao';
      case 'ORÇADA':
        return 'os-card-orcada';
      case 'REDIRECIONADA':
        return 'os-card-redirecionada';
      case 'FINALIZADA':
        return 'os-card-finalizada';
      default:
        return '';
    }
  }

  getClasseBadge(status: StatusSolicitacao): string {
    switch (status) {
      case 'PAGA':
        return 'os-badge-paga';
      case 'APROVADA':
        return 'os-badge-aprovada';
      case 'EM MANUTENÇÃO':
        return 'os-badge-manutencao';
      case 'ORÇADA':
        return 'os-badge-orcada';
      case 'REDIRECIONADA':
        return 'os-badge-redirecionada';
      case 'FINALIZADA':
        return 'os-badge-finalizada';
      default:
        return '';
    }
  }

  getClasseIndicador(status: StatusSolicitacao): string {
    switch (status) {
      case 'ORÇADA':
        return 'os-indicador-orcada';
      case 'FINALIZADA':
        return 'os-indicador-finalizada';
      default:
        return 'os-indicador-neutro';
    }
  }
}