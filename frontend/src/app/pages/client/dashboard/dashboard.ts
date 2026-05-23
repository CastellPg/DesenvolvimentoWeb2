import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { SolicitacaoService, SolicitacaoResponse } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  nomeCliente: string | null = null;
  solicitacoes: SolicitacaoResponse[] = [];
  carregando = false;
  erro: string | null = null;

  private solicitacaoService = inject(SolicitacaoService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.nomeCliente = localStorage.getItem('nomeUsuario');
    this.carregarSistema();
  }

  carregarSistema(): void {
    const clienteIdLogado = Number(localStorage.getItem('usuarioId'));

    if (!clienteIdLogado) {
      this.erro = 'Sessão inválida. Faça login novamente.';
      this.cdr.detectChanges();
      return;
    }

    this.carregando = true;
    this.erro = null;
    this.cdr.detectChanges();

    this.solicitacaoService.listarPorCliente(clienteIdLogado)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (dadosRetornadosDoBanco) => {
          this.solicitacoes = dadosRetornadosDoBanco
            .filter((solicitacao) => this.exigeAcaoDoCliente(solicitacao.status))
            .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
          this.cdr.detectChanges();
        },
        error: (erro) => {
          console.error('Erro ao buscar do backend', erro);
          this.erro = this.extrairMensagemErro(erro);
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
      case 'APROVADA': return 'APROVADA';
      case 'REJEITADA': return 'REJEITADA';
      case 'REDIRECIONADA': return 'REDIRECIONADA';
      case 'ARRUMADA': return 'ARRUMADA';
      case 'PAGA': return 'PAGA';
      case 'FINALIZADA': return 'FINALIZADA';
      case 'ABERTA': return 'ABERTA';
      default: return status;
    }
  }

  private exigeAcaoDoCliente(status: string): boolean {
    return status === 'ORCADA' || status === 'ARRUMADA';
  }

  private extrairMensagemErro(err: any): string {
    if (err?.name === 'TimeoutError') {
      return 'Backend demorou demais para responder ao buscar suas pendências.';
    }

    if (err?.status === 0) {
      return 'Não foi possível conectar ao backend em http://localhost:8080.';
    }

    return err?.error?.messages?.join(' | ') || err?.error?.message || 'Não foi possível carregar suas pendências.';
  }
}
