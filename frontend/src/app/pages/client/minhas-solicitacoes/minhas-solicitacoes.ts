import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { SolicitacaoResponse, SolicitacaoService } from '../../../services/solicitacao.service';

export interface Solicitacao {
  id: number;
  dataHora: string | Date;
  equipamento: string;
  categoria: string;
  estado: string;
  valor?: number | null;
  descricaoDefeito?: string;
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
  carregando = false;
  erro: string | null = null;

  private solicitacaoService = inject(SolicitacaoService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    const clienteId = Number(localStorage.getItem('usuarioId'));

    if (!clienteId) {
      this.erro = 'Sessão inválida. Faça login novamente.';
      return;
    }

    this.carregarSolicitacoesDoCache(clienteId);
    this.carregando = this.todasSolicitacoes.length === 0;
    this.erro = null;
    this.cdr.detectChanges();

    this.solicitacaoService.listarPorCliente(clienteId)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (resposta) => {
          this.todasSolicitacoes = resposta
            .map((solicitacao) => this.converterSolicitacao(solicitacao))
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
          this.salvarSolicitacoesNoCache(clienteId);
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (this.todasSolicitacoes.length === 0) {
            this.erro = this.extrairMensagemErro(err);
          }
          this.cdr.detectChanges();
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

  getClasseCard(status: string): string {
    switch (status) {
      case 'ABERTA': return 'os-card-aberta';
      case 'PAGA': return 'os-card-paga';
      case 'APROVADA': return 'os-card-aprovada';
      case 'ORCADA': return 'os-card-orcada';
      case 'REJEITADA': return 'os-card-rejeitada';
      case 'REDIRECIONADA': return 'os-card-redirecionada';
      case 'ARRUMADA': return 'os-card-arrumada';
      case 'FINALIZADA': return 'os-card-finalizada';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ORCADA': return 'ORÇADA';
      case 'ABERTA': return 'ABERTA';
      case 'APROVADA': return 'APROVADA';
      case 'REJEITADA': return 'REJEITADA';
      case 'REDIRECIONADA': return 'REDIRECIONADA';
      case 'ARRUMADA': return 'ARRUMADA';
      case 'PAGA': return 'PAGA';
      case 'FINALIZADA': return 'FINALIZADA';
      default: return status;
    }
  }

  private converterSolicitacao(solicitacao: SolicitacaoResponse): Solicitacao {
    return {
      id: solicitacao.id,
      dataHora: solicitacao.dataCriacao,
      equipamento: solicitacao.descricaoEquipamento || '-',
      categoria: solicitacao.categoria || '-',
      estado: solicitacao.status,
      valor: solicitacao.valorOrcado,
      descricaoDefeito: solicitacao.descricaoDefeito || '-'
    };
  }

  private carregarSolicitacoesDoCache(clienteId: number): void {
    const cache = localStorage.getItem(`solicitacoes-cliente-${clienteId}`);

    if (!cache) {
      return;
    }

    try {
      this.todasSolicitacoes = JSON.parse(cache);
    } catch {
      localStorage.removeItem(`solicitacoes-cliente-${clienteId}`);
    }
  }

  private salvarSolicitacoesNoCache(clienteId: number): void {
    localStorage.setItem(`solicitacoes-cliente-${clienteId}`, JSON.stringify(this.todasSolicitacoes));
  }

  private extrairMensagemErro(err: any): string {
    if (err?.name === 'TimeoutError') {
      return 'Backend demorou demais para responder ao buscar suas solicitações.';
    }

    if (err?.status === 0) {
      return 'Não foi possível conectar ao backend em http://localhost:8080.';
    }

    return err?.error?.messages?.join(' | ') || err?.error?.message || 'Não foi possível carregar suas solicitações.';
  }
}
