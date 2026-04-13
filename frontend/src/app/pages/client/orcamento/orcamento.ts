import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SolicitacaoService, SolicitacaoResponse } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orcamento.html'
})
export class OrcamentoComponent implements OnInit {

  orcamento: SolicitacaoResponse | null = null;
  solicitacaoId: string | null = null;
  carregando = true;
  erroCarregamento: string | null = null;

  mostrarModalAprovar = false;
  mostrarModalRejeitar = false;

  toastVisivel = false;
  toastMensagem = '';
  toastTipo: 'success' | 'danger' = 'success';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitacaoService = inject(SolicitacaoService);

  ngOnInit(): void {
    this.solicitacaoId = this.route.snapshot.paramMap.get('id');
    if (this.solicitacaoId) {
      this.buscarDados(this.solicitacaoId);
    }
  }

  buscarDados(id: string): void {
    this.carregando = true;
    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (dados) => {
        this.orcamento = dados;
        this.carregando = false;
      },
      error: () => {
        this.erroCarregamento = 'Não foi possível carregar os dados da solicitação.';
        this.carregando = false;
      }
    });
  }

  abrirModalAprovar() { this.mostrarModalAprovar = true; }
  fecharModalAprovar() { this.mostrarModalAprovar = false; }

  abrirModalRejeitar() { this.mostrarModalRejeitar = true; }
  fecharModalRejeitar() { this.mostrarModalRejeitar = false; }

  exibirToast(mensagem: string, tipo: 'success' | 'danger') {
    this.toastMensagem = mensagem;
    this.toastTipo = tipo;
    this.toastVisivel = true;
    setTimeout(() => { this.toastVisivel = false; }, 3500);
  }

  confirmarAprovacao(): void {
    if (!this.solicitacaoId) return;
    this.solicitacaoService.aprovarSolicitacao(this.solicitacaoId).subscribe({
      next: (atualizado) => {
        this.orcamento = atualizado;
        this.fecharModalAprovar();
        this.exibirToast('Serviço Aprovado com sucesso! Iniciando manutenção...', 'success');
      },
      error: () => this.exibirToast('Erro ao aprovar solicitação. Tente novamente.', 'danger')
    });
  }

  confirmarRejeicao(motivoDigitado: string): void {
    if (!motivoDigitado?.trim()) {
      this.exibirToast('Atenção: É obrigatório informar um motivo para rejeitar!', 'danger');
      return;
    }
    this.solicitacaoService.rejeitarSolicitacao(this.solicitacaoId!, motivoDigitado).subscribe({
      next: (atualizado) => {
        this.orcamento = atualizado;
        this.fecharModalRejeitar();
        this.exibirToast('Serviço Rejeitado com sucesso. O equipamento será devolvido.', 'success');
      },
      error: () => this.exibirToast('Erro ao rejeitar solicitação. Tente novamente.', 'danger')
    });
  }

  getBadgeClass(status: string): string {
    // RF013 — escala de cores obrigatória
    switch (status) {
      case 'ABERTA':         return 'bg-secondary';
      case 'ORCADA':         return 'bg-marrom';
      case 'APROVADA':       return 'bg-warning text-dark';
      case 'REJEITADA':      return 'bg-danger';
      case 'REDIRECIONADA':  return 'bg-roxo';
      case 'ARRUMADA':       return 'bg-primary';
      case 'PAGA':           return 'bg-laranja';
      case 'FINALIZADA':     return 'bg-success';
      default:               return 'bg-secondary';
    }
  }
}