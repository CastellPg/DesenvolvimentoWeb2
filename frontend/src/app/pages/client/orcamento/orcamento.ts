import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
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
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.solicitacaoId = this.route.snapshot.paramMap.get('id');
    if (!this.solicitacaoId) {
      this.erroCarregamento = 'Solicitacao nao informada na rota.';
      this.carregando = false;
      this.cdr.detectChanges();
      return;
    }

    this.buscarDados(this.solicitacaoId);
  }

  buscarDados(id: string): void {
    this.carregarOrcamentoDoCache(id);
    this.carregando = !this.orcamento;
    this.erroCarregamento = null;
    this.cdr.detectChanges();

    this.solicitacaoService.buscarPorId(Number(id))
      .pipe(
        timeout(10000),
        finalize(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (dados) => {
          this.orcamento = dados;
          this.atualizarSolicitacaoNoCache(dados);
          this.mensagemErro = null;
          this.cdr.detectChanges();
        },
        error: (erro) => {
          this.erroCarregamento = this.extrairMensagemErro(erro, 'Nao foi possivel carregar os dados da solicitacao.');
          this.cdr.detectChanges();
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
    this.cdr.detectChanges();

    this.solicitacaoService.aprovarOrcamento(ids.solicitacaoId, ids.clienteId).subscribe({
      next: (solicitacaoAtualizada) => {
        this.orcamento = solicitacaoAtualizada;
        this.atualizarSolicitacaoNoCache(solicitacaoAtualizada);
        this.mensagemSucesso = 'Orcamento aprovado com sucesso.';
        this.processandoDecisao = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.mensagemErro = this.extrairMensagemErro(erro, 'Nao foi possivel aprovar o orcamento.');
        this.processandoDecisao = false;
        this.cdr.detectChanges();
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
      this.cdr.detectChanges();
      return;
    }

    this.processandoDecisao = true;
    this.limparMensagens();
    this.cdr.detectChanges();

    this.solicitacaoService.rejeitarOrcamento(ids.solicitacaoId, { motivo }, ids.clienteId).subscribe({
      next: (solicitacaoAtualizada) => {
        this.orcamento = solicitacaoAtualizada;
        this.atualizarSolicitacaoNoCache(solicitacaoAtualizada);
        this.motivoRejeicao = '';
        this.mensagemSucesso = 'Orcamento rejeitado com sucesso.';
        this.processandoDecisao = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.mensagemErro = this.extrairMensagemErro(erro, 'Nao foi possivel rejeitar o orcamento.');
        this.processandoDecisao = false;
        this.cdr.detectChanges();
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
      this.cdr.detectChanges();
      return null;
    }

    return { solicitacaoId, clienteId };
  }

  private limparMensagens(): void {
    this.mensagemErro = null;
    this.mensagemSucesso = null;
  }

  private carregarOrcamentoDoCache(id: string): void {
    const clienteId = localStorage.getItem('usuarioId');
    if (!clienteId) {
      return;
    }

    const cache = localStorage.getItem(`solicitacoes-cliente-${clienteId}`);
    if (!cache) {
      return;
    }

    try {
      const solicitacoes = JSON.parse(cache);
      const solicitacaoCache = solicitacoes.find((item: any) => String(item.id) === String(id));

      if (!solicitacaoCache) {
        return;
      }

      this.orcamento = {
        id: Number(solicitacaoCache.id),
        descricaoEquipamento: solicitacaoCache.equipamento || solicitacaoCache.descricaoEquipamento || '-',
        categoria: solicitacaoCache.categoria || '-',
        descricaoDefeito: solicitacaoCache.descricaoDefeito || '-',
        status: solicitacaoCache.estado || solicitacaoCache.status || 'ORCADA',
        dataCriacao: solicitacaoCache.dataHora || solicitacaoCache.dataCriacao || new Date().toISOString(),
        valorOrcado: solicitacaoCache.valor ?? solicitacaoCache.valorOrcado ?? null,
        motivoRejeicao: solicitacaoCache.motivoRejeicao ?? null,
      };
    } catch {
      localStorage.removeItem(`solicitacoes-cliente-${clienteId}`);
    }
  }

  private atualizarSolicitacaoNoCache(solicitacaoAtualizada: any): void {
    const clienteId = localStorage.getItem('usuarioId');
    if (!clienteId) {
      return;
    }

    const cacheKey = `solicitacoes-cliente-${clienteId}`;
    const cache = localStorage.getItem(cacheKey);
    if (!cache) {
      return;
    }

    try {
      const solicitacoes = JSON.parse(cache);
      const novasSolicitacoes = solicitacoes.map((item: any) => {
        if (Number(item.id) !== Number(solicitacaoAtualizada.id)) {
          return item;
        }

        return {
          ...item,
          estado: solicitacaoAtualizada.status,
          status: solicitacaoAtualizada.status,
          valor: solicitacaoAtualizada.valorOrcado,
          valorOrcado: solicitacaoAtualizada.valorOrcado,
          motivoRejeicao: solicitacaoAtualizada.motivoRejeicao,
        };
      });

      localStorage.setItem(cacheKey, JSON.stringify(novasSolicitacoes));
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  private extrairMensagemErro(erro: any, mensagemPadrao: string): string {
    if (erro?.name === 'TimeoutError') {
      return 'O backend demorou demais para responder.';
    }

    if (erro?.status === 409) {
      return erro.error?.messages?.join(' | ') || 'Essa solicitacao nao esta mais ORCADA.';
    }

    if (erro?.status === 0) {
      return 'Nao foi possivel conectar ao backend em http://localhost:8080.';
    }

    return erro?.error?.messages?.join(' | ') || erro?.error?.message || mensagemPadrao;
  }

  getBadgeClass(status: string): string {
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
