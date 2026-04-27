import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orcamento.html',
})
export class OrcamentoComponent implements OnInit {
  orcamento: any | null = null;
  solicitacaoId: string | null = null;
  carregando = true;
  processandoDecisao = false;
  erroCarregamento: string | null = null;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;
  motivoRejeicao = '';

  private route = inject(ActivatedRoute);
  private solicitacaoService = inject(SolicitacaoService);

  ngOnInit(): void {
    this.solicitacaoId = this.route.snapshot.paramMap.get('id');
    if (this.solicitacaoId) {
      this.buscarDados(this.solicitacaoId);
    }
  }

  buscarDados(id: string): void {
    this.carregando = true;
    this.solicitacaoService.buscarPorId(Number(id)).subscribe({
      next: (dados) => {
        this.orcamento = dados;
        this.carregando = false;
        this.mensagemErro = null;
      },
      error: () => {
        this.erroCarregamento = 'Não foi possível carregar os dados da solicitação.';
        this.carregando = false;
      },
    });
  }

  aprovar(): void {
    const ids = this.obterIdsParaDecisao();
    if (!ids) {
      return;
    }

    this.processandoDecisao = true;
    this.limparMensagens();

    this.solicitacaoService.aprovarOrcamento(ids.solicitacaoId, ids.clienteId).subscribe({
      next: (solicitacaoAtualizada) => {
        this.orcamento = solicitacaoAtualizada;
        this.mensagemSucesso = 'Orcamento aprovado com sucesso.';
        this.processandoDecisao = false;
      },
      error: (erro) => {
        this.mensagemErro = this.extrairMensagemErro(erro, 'Nao foi possivel aprovar o orcamento.');
        this.processandoDecisao = false;
      }
    });
  }

  rejeitar(): void {
    const ids = this.obterIdsParaDecisao();
    if (!ids) {
      return;
    }

    const motivo = this.motivoRejeicao.trim();
    if (!motivo) {
      this.mensagemErro = 'Informe o motivo da rejeicao.';
      return;
    }

    this.processandoDecisao = true;
    this.limparMensagens();

    this.solicitacaoService.rejeitarOrcamento(ids.solicitacaoId, { motivo }, ids.clienteId).subscribe({
      next: (solicitacaoAtualizada) => {
        this.orcamento = solicitacaoAtualizada;
        this.motivoRejeicao = '';
        this.mensagemSucesso = 'Orcamento rejeitado com sucesso.';
        this.processandoDecisao = false;
      },
      error: (erro) => {
        this.mensagemErro = this.extrairMensagemErro(erro, 'Nao foi possivel rejeitar o orcamento.');
        this.processandoDecisao = false;
      }
    });
  }

  podeDecidir(): boolean {
    return this.orcamento?.status === 'ORCADA';
  }

  private obterIdsParaDecisao(): { solicitacaoId: number; clienteId: number } | null {
    const solicitacaoId = Number(this.solicitacaoId);
    const clienteId = Number(localStorage.getItem('usuarioId'));

    if (!solicitacaoId || !clienteId) {
      this.mensagemErro = 'Nao foi possivel identificar a solicitacao ou o cliente logado.';
      return null;
    }

    return { solicitacaoId, clienteId };
  }

  private limparMensagens(): void {
    this.mensagemErro = null;
    this.mensagemSucesso = null;
  }

  private extrairMensagemErro(erro: any, mensagemPadrao: string): string {
    if (erro?.status === 409) {
      return erro.error?.messages?.join(' | ') || 'Essa solicitacao nao esta mais ORCADA.';
    }

    return erro?.error?.messages?.join(' | ') || erro?.error?.message || mensagemPadrao;
  }

  getBadgeClass(status: string): string {
    // RF013 — escala de cores obrigatória
    switch (status) {
      case 'ABERTA':
        return 'bg-secondary';
      case 'ORCADA':
        return 'bg-marrom';
      case 'APROVADA':
        return 'bg-warning text-dark';
      case 'REJEITADA':
        return 'bg-danger';
      case 'REDIRECIONADA':
        return 'bg-roxo';
      case 'ARRUMADA':
        return 'bg-primary';
      case 'PAGA':
        return 'bg-laranja';
      case 'FINALIZADA':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
}
