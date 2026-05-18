import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { SolicitacaoResponse, SolicitacaoService } from '../../../services/solicitacao.service';

interface PreCondicaoFinalizacao {
  titulo: string;
  descricao: string;
  concluida: boolean;
}

@Component({
  selector: 'app-finalizar-solicitacao',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './finalizar-solicitacao.html',
  styleUrl: './finalizar-solicitacao.css',
})
export class FinalizarSolicitacaoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private solicitacaoService = inject(SolicitacaoService);

  solicitacao: SolicitacaoResponse | null = null;
  nomeUsuario = localStorage.getItem('nomeUsuario') ?? 'Funcionario';
  funcionarioId = Number(localStorage.getItem('usuarioId'));
  dataHoraAtual = new Date();

  carregando = false;
  enviando = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.mensagemErro = 'Solicitacao nao informada na rota.';
      return;
    }

    this.carregarSolicitacao(id);
  }

  carregarSolicitacao(id: string): void {
    this.carregando = true;
    this.mensagemErro = null;
    this.carregarSolicitacaoDoCache(id);
    this.cdr.detectChanges();

    this.solicitacaoService.buscarPorId(id).pipe(
      timeout(10000),
      finalize(() => {
        this.carregando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (dados) => {
        this.solicitacao = dados;
        this.atualizarSolicitacaoNoCache(dados);
      },
      error: (err) => {
        if (!this.solicitacao) {
          this.mensagemErro = this.extrairMensagemErro(err, 'Erro ao carregar os dados da solicitacao.');
        }
      }
    });
  }

  confirmarFinalizacao(): void {
    if (!this.solicitacao || !this.podeFinalizar) {
      this.mensagemErro = this.mensagemBloqueioFinalizacao;
      return;
    }

    if (!this.funcionarioId) {
      this.mensagemErro = 'Sessao invalida. Faca login novamente.';
      return;
    }

    this.enviando = true;
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    this.solicitacaoService.finalizarSolicitacao(this.solicitacao.id, this.funcionarioId).pipe(
      timeout(10000),
      finalize(() => {
        this.enviando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (solicitacaoAtualizada) => {
        this.solicitacao = solicitacaoAtualizada;
        this.atualizarSolicitacaoNoCache(solicitacaoAtualizada);
        this.mensagemSucesso = 'Solicitacao finalizada com sucesso!';
        setTimeout(() => this.router.navigate(['/solicitacoes']), 1800);
      },
      error: (err) => {
        this.mensagemErro = this.extrairMensagemErro(err, 'Erro ao finalizar a solicitacao.');
      }
    });
  }

  get podeFinalizar(): boolean {
    return this.todasPreCondicoesAtendidas && !this.enviando;
  }

  get statusPago(): boolean {
    return this.solicitacao?.status === 'PAGA';
  }

  get pagamentoConfirmado(): boolean {
    return !!this.solicitacao?.dataHoraPagamento && this.solicitacao?.valorPago != null;
  }

  get manutencaoConcluidaNoFluxo(): boolean {
    return this.solicitacao?.status === 'PAGA' || this.solicitacao?.status === 'FINALIZADA';
  }

  get solicitacaoJaFinalizada(): boolean {
    return this.solicitacao?.status === 'FINALIZADA';
  }

  get todasPreCondicoesAtendidas(): boolean {
    return this.statusPago && this.pagamentoConfirmado && this.manutencaoConcluidaNoFluxo;
  }

  get preCondicoesFinalizacao(): PreCondicaoFinalizacao[] {
    return [
      {
        titulo: 'Status PAGA',
        descricao: 'A OS precisa estar no estado PAGA antes da finalizacao.',
        concluida: this.statusPago
      },
      {
        titulo: 'Pagamento confirmado',
        descricao: 'Valor e data/hora do pagamento devem estar registrados.',
        concluida: this.pagamentoConfirmado
      },
      {
        titulo: 'Manutencao concluida',
        descricao: 'A OS so chega em PAGA depois de passar por ARRUMADA.',
        concluida: this.manutencaoConcluidaNoFluxo
      }
    ];
  }

  get mensagemBloqueioFinalizacao(): string {
    if (this.solicitacaoJaFinalizada) {
      return 'Esta solicitacao ja esta finalizada e nao permite nova transicao.';
    }

    const pendente = this.preCondicoesFinalizacao.find(item => !item.concluida);
    return pendente
      ? `Pre-condicao pendente: ${pendente.titulo}.`
      : 'A solicitacao ainda nao pode ser finalizada.';
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'PAGA': return 'bg-laranja';
      case 'FINALIZADA': return 'bg-success';
      case 'ARRUMADA': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  getPreCondicaoClass(preCondicao: PreCondicaoFinalizacao): string {
    return preCondicao.concluida
      ? 'border-success-subtle bg-success-subtle text-success'
      : 'border-warning-subtle bg-warning-subtle text-warning-emphasis';
  }

  getPreCondicaoIcone(preCondicao: PreCondicaoFinalizacao): string {
    return preCondicao.concluida ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
  }

  private carregarSolicitacaoDoCache(id: string): void {
    const funcionarioId = localStorage.getItem('usuarioId');
    if (!funcionarioId) return;

    const cache = localStorage.getItem(`solicitacoes-funcionario-${funcionarioId}`);
    if (!cache) return;

    try {
      const solicitacoes = JSON.parse(cache);
      const encontrada = Array.isArray(solicitacoes)
        ? solicitacoes.find((item: any) => String(item.id) === String(id))
        : null;

      if (!encontrada) return;

      this.solicitacao = {
        id: Number(encontrada.id),
        descricaoEquipamento: encontrada.produto || encontrada.descricaoEquipamento || '-',
        categoria: encontrada.categoria || '-',
        descricaoDefeito: encontrada.problema || encontrada.descricaoDefeito || '-',
        status: encontrada.status || 'PAGA',
        dataCriacao: encontrada.dataOriginal || encontrada.dataCriacao || new Date().toISOString(),
        valorOrcado: encontrada.valorOrcado ?? null,
        valorPago: encontrada.valorPago ?? null,
        dataHoraPagamento: encontrada.dataHoraPagamento ?? null,
        pagamentoDivergente: encontrada.pagamentoDivergente ?? false,
        motivoRejeicao: encontrada.motivoRejeicao ?? null,
        cliente: encontrada.cliente ?? null
      };
    } catch {
      localStorage.removeItem(`solicitacoes-funcionario-${funcionarioId}`);
    }
  }

  private atualizarSolicitacaoNoCache(solicitacaoAtualizada: SolicitacaoResponse): void {
    const funcionarioId = localStorage.getItem('usuarioId');
    if (!funcionarioId) return;

    const cacheKey = `solicitacoes-funcionario-${funcionarioId}`;
    const cache = localStorage.getItem(cacheKey);
    if (!cache) return;

    try {
      const solicitacoes = JSON.parse(cache);
      if (!Array.isArray(solicitacoes)) return;

      const atualizadas = solicitacoes.map((item: any) =>
        Number(item.id) === Number(solicitacaoAtualizada.id)
          ? {
              ...item,
              status: solicitacaoAtualizada.status,
              acao: solicitacaoAtualizada.status === 'FINALIZADA' ? 'Concluida' : item.acao,
              valorOrcado: solicitacaoAtualizada.valorOrcado,
              valorPago: solicitacaoAtualizada.valorPago,
              dataHoraPagamento: solicitacaoAtualizada.dataHoraPagamento,
              pagamentoDivergente: solicitacaoAtualizada.pagamentoDivergente,
              motivoRejeicao: solicitacaoAtualizada.motivoRejeicao,
            }
          : item
      );

      localStorage.setItem(cacheKey, JSON.stringify(atualizadas));
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  private extrairMensagemErro(err: any, mensagemPadrao: string): string {
    if (err?.name === 'TimeoutError') {
      return 'Backend demorou demais para responder.';
    }

    if (err?.status === 0) {
      return 'Nao foi possivel conectar ao backend em http://localhost:8080.';
    }

    return err?.error?.messages?.join(' | ') || err?.error?.message || mensagemPadrao;
  }
}
