import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { OrcamentoResponse, SolicitacaoResponse, SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orcamento.html',
  styleUrl: './orcamento.css',
})
export class OrcamentoComponent implements OnInit {
  solicitacao: SolicitacaoResponse | null = null;
  orcamentoDetalhado: OrcamentoResponse | null = null;
  solicitacaoId: string | null = null;
  carregando = true;
  processandoDecisao = false;
  erroCarregamento: string | null = null;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;
  motivoRejeicao = '';
  exibindoRejeicao = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitacaoService = inject(SolicitacaoService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.solicitacaoId = this.route.snapshot.paramMap.get('id');

    if (!this.solicitacaoId) {
      this.erroCarregamento = 'Solicitação não informada na rota.';
      this.carregando = false;
      this.cdr.detectChanges();
      return;
    }

    this.buscarDados(this.solicitacaoId);
  }

  buscarDados(id: string): void {
    this.carregando = true;
    this.erroCarregamento = null;
    this.mensagemErro = null;
    this.carregarSolicitacaoDoCache(id);
    this.cdr.detectChanges();

    this.solicitacaoService.buscarPorId(Number(id)).pipe(
      timeout(10000),
      finalize(() => {
        this.carregando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (dados) => {
        this.solicitacao = dados;
        this.atualizarSolicitacaoNoCache(dados);
        this.cdr.detectChanges();

        if (dados.status === 'ORCADA' || dados.valorOrcado !== null) {
          this.carregarOrcamentoDetalhado(Number(id));
        }
      },
      error: (erro) => {
        if (!this.solicitacao) {
          this.erroCarregamento = this.extrairMensagemErro(erro, 'Não foi possível carregar os dados da solicitação.');
        }
      },
    });
  }

  aprovar(): void {
    const ids = this.obterIdsParaDecisao();
    if (!ids) return;

    this.processandoDecisao = true;
    this.limparMensagens();
    this.cdr.detectChanges();

    this.solicitacaoService.aprovarOrcamento(ids.solicitacaoId, ids.clienteId).subscribe({
      next: (solicitacaoAtualizada) => {
        this.solicitacao = solicitacaoAtualizada;
        this.atualizarSolicitacaoNoCache(solicitacaoAtualizada);
        this.mensagemSucesso = 'Serviço aprovado com sucesso.';
        this.processandoDecisao = false;
        this.cdr.detectChanges();
        this.voltarParaListaAposDecisao();
      },
      error: (erro) => {
        this.mensagemErro = this.extrairMensagemErro(erro, 'Não foi possível aprovar o serviço.');
        this.processandoDecisao = false;
        this.cdr.detectChanges();
      }
    });
  }

  rejeitar(): void {
    const ids = this.obterIdsParaDecisao();
    if (!ids) return;

    const motivo = this.motivoRejeicao.trim();
    if (!motivo) {
      this.mensagemErro = 'Informe o motivo da rejeição.';
      this.cdr.detectChanges();
      return;
    }

    this.processandoDecisao = true;
    this.limparMensagens();
    this.cdr.detectChanges();

    this.solicitacaoService.rejeitarOrcamento(ids.solicitacaoId, { motivo }, ids.clienteId).subscribe({
      next: (solicitacaoAtualizada) => {
        this.solicitacao = solicitacaoAtualizada;
        this.atualizarSolicitacaoNoCache(solicitacaoAtualizada);
        this.motivoRejeicao = '';
        this.exibindoRejeicao = false;
        this.mensagemSucesso = 'Serviço rejeitado com sucesso.';
        this.processandoDecisao = false;
        this.cdr.detectChanges();
        this.voltarParaListaAposDecisao();
      },
      error: (erro) => {
        this.mensagemErro = this.extrairMensagemErro(erro, 'Não foi possível rejeitar o serviço.');
        this.processandoDecisao = false;
        this.cdr.detectChanges();
      }
    });
  }

  podeDecidir(): boolean {
    return this.solicitacao?.status === 'ORCADA';
  }

  mostrarRejeicao(): void {
    this.exibindoRejeicao = true;
    this.limparMensagens();
  }

  cancelarRejeicao(): void {
    this.exibindoRejeicao = false;
    this.motivoRejeicao = '';
    this.limparMensagens();
  }

  tituloStatus(): string {
    if (this.solicitacao?.status === 'APROVADA') return 'Serviço aprovado';
    if (this.solicitacao?.status === 'REJEITADA') return 'Serviço rejeitado';
    return 'Aguardando decisão';
  }

  textoStatus(): string {
    if (this.solicitacao?.status === 'APROVADA') {
      return 'O serviço foi autorizado e agora pode seguir para manutenção.';
    }

    if (this.solicitacao?.status === 'REJEITADA') {
      return 'O orçamento foi recusado. O motivo fica registrado no histórico da solicitação.';
    }

    return 'Confira o valor e os itens do orçamento antes de aprovar ou rejeitar.';
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'ABERTA': return 'bg-secondary';
      case 'ORCADA': return 'bg-marrom';
      case 'APROVADA': return 'bg-warning text-dark';
      case 'REJEITADA': return 'bg-danger';
      case 'REDIRECIONADA': return 'bg-roxo';
      case 'ARRUMADA': return 'bg-primary';
      case 'PAGA': return 'bg-laranja';
      case 'FINALIZADA': return 'bg-success';
      default: return 'bg-secondary';
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

  getTipoItemLabel(tipo: string): string {
    switch (tipo) {
      case 'PECA': return 'Peça';
      case 'MAO_OBRA': return 'Mão de Obra';
      case 'SERVICO': return 'Serviço';
      default: return tipo;
    }
  }

  private carregarOrcamentoDetalhado(id: number): void {
    this.solicitacaoService.buscarUltimoOrcamento(id).pipe(
      timeout(10000)
    ).subscribe({
      next: (orcamento) => {
        this.orcamentoDetalhado = orcamento;
        this.cdr.detectChanges();
      },
      error: () => {
        this.orcamentoDetalhado = null;
        this.cdr.detectChanges();
      }
    });
  }

  private obterIdsParaDecisao(): { solicitacaoId: number; clienteId: number } | null {
    const solicitacaoId = Number(this.solicitacaoId);
    const clienteId = Number(localStorage.getItem('usuarioId'));

    if (!solicitacaoId || !clienteId) {
      this.mensagemErro = 'Não foi possível identificar a solicitação ou o cliente logado.';
      this.cdr.detectChanges();
      return null;
    }

    return { solicitacaoId, clienteId };
  }

  private limparMensagens(): void {
    this.mensagemErro = null;
    this.mensagemSucesso = null;
  }

  private voltarParaListaAposDecisao(): void {
    setTimeout(() => this.router.navigate(['/client/minhas-solicitacoes']), 1200);
  }

  private carregarSolicitacaoDoCache(id: string): void {
    const clienteId = localStorage.getItem('usuarioId');
    if (!clienteId) return;

    const cache = localStorage.getItem(`solicitacoes-cliente-${clienteId}`);
    if (!cache) return;

    try {
      const solicitacoes = JSON.parse(cache);
      const solicitacaoCache = Array.isArray(solicitacoes)
        ? solicitacoes.find((item: any) => String(item.id) === String(id))
        : null;

      if (!solicitacaoCache) return;

      this.solicitacao = {
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

  private atualizarSolicitacaoNoCache(solicitacaoAtualizada: SolicitacaoResponse): void {
    const clienteId = localStorage.getItem('usuarioId');
    if (!clienteId) return;

    const cacheKey = `solicitacoes-cliente-${clienteId}`;
    const cache = localStorage.getItem(cacheKey);
    if (!cache) return;

    try {
      const solicitacoes = JSON.parse(cache);
      if (!Array.isArray(solicitacoes)) return;

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
      return erro.error?.messages?.join(' | ') || 'Essa solicitação não está mais ORCADA.';
    }

    if (erro?.status === 0) {
      return 'Não foi possível conectar ao backend em http://localhost:8080.';
    }

    return erro?.error?.messages?.join(' | ') || erro?.error?.message || mensagemPadrao;
  }
}
