import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { SolicitacaoResponse, SolicitacaoService } from '../../../services/solicitacao.service';

declare var bootstrap: any;

export interface SolicitacaoPagamento {
  id: number;
  dataHora: string;
  equipamento: string;
  categoria: string;
  descricaoDefeito: string;
  estado: string;
  valor: number;
}

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagamento.html',
  styleUrls: ['./pagamento.css']
})
export class PagamentoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private solicitacaoService = inject(SolicitacaoService);

  solicitacaoId!: number;
  servico: SolicitacaoPagamento | null = null;
  mensagemToast = '';
  mensagemErro: string | null = null;
  carregando = false;
  enviando = false;
  mostrarModal = false;

  ngOnInit(): void {
    this.solicitacaoId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.solicitacaoId) {
      this.mensagemErro = 'Solicitacao nao informada na rota.';
      return;
    }

    this.buscarServicoArrumado(this.solicitacaoId);
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
  }

  mostrarToast(mensagem: string): void {
    this.mensagemToast = mensagem;
    const toastElement = document.getElementById('avisoSucesso');
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
      toast.show();
    }
  }

  buscarServicoArrumado(id: number): void {
    this.carregando = true;
    this.mensagemErro = null;

    this.solicitacaoService.buscarPorId(id).pipe(
      timeout(10000),
      finalize(() => this.carregando = false)
    ).subscribe({
      next: (solicitacao) => {
        this.servico = this.converterSolicitacao(solicitacao);
        this.atualizarSolicitacaoClienteNoCache(solicitacao);
      },
      error: (err) => {
        this.carregarServicoDoCache(id);
        if (!this.servico) {
          this.mensagemErro = this.extrairMensagemErro(err, 'Erro ao carregar os dados do pagamento.');
        }
      }
    });
  }

  confirmarPagamento(): void {
    const clienteId = Number(localStorage.getItem('usuarioId'));

    if (!clienteId || !this.servico) {
      this.mensagemErro = 'Sessao invalida. Faca login novamente.';
      return;
    }

    this.enviando = true;
    this.mensagemErro = null;

    this.solicitacaoService.confirmarPagamento(this.solicitacaoId, clienteId).pipe(
      timeout(10000),
      finalize(() => this.enviando = false)
    ).subscribe({
      next: (solicitacaoAtualizada) => {
        this.servico = this.converterSolicitacao(solicitacaoAtualizada);
        this.atualizarSolicitacaoClienteNoCache(solicitacaoAtualizada);
        this.fecharModal();
        this.mostrarToast('Pagamento confirmado com sucesso! O servico agora consta como PAGO.');
        setTimeout(() => this.router.navigate(['/client/dashboard']), 1800);
      },
      error: (err) => {
        this.mensagemErro = this.extrairMensagemErro(err, 'Erro ao confirmar o pagamento.');
      }
    });
  }

  private converterSolicitacao(solicitacao: SolicitacaoResponse): SolicitacaoPagamento {
    return {
      id: solicitacao.id,
      dataHora: solicitacao.dataCriacao,
      equipamento: solicitacao.descricaoEquipamento,
      categoria: solicitacao.categoria || '-',
      descricaoDefeito: solicitacao.descricaoDefeito,
      estado: solicitacao.status,
      valor: solicitacao.valorOrcado ?? 0
    };
  }

  private carregarServicoDoCache(id: number): void {
    const clienteId = localStorage.getItem('usuarioId');
    if (!clienteId) return;

    const cache = localStorage.getItem(`solicitacoes-cliente-${clienteId}`);
    if (!cache) return;

    try {
      const solicitacoes = JSON.parse(cache);
      const encontrada = Array.isArray(solicitacoes)
        ? solicitacoes.find((item: any) => Number(item.id) === id)
        : null;

      if (!encontrada) return;

      this.servico = {
        id: Number(encontrada.id),
        dataHora: encontrada.dataOriginal || encontrada.dataHora || new Date().toISOString(),
        equipamento: encontrada.produto || encontrada.descricaoEquipamento || '-',
        categoria: encontrada.categoria || '-',
        descricaoDefeito: encontrada.problema || encontrada.descricaoDefeito || '-',
        estado: encontrada.estado || encontrada.status || 'ARRUMADA',
        valor: encontrada.valor || encontrada.valorOrcado || 0
      };
    } catch {
      localStorage.removeItem(`solicitacoes-cliente-${clienteId}`);
    }
  }

  private atualizarSolicitacaoClienteNoCache(solicitacaoAtualizada: SolicitacaoResponse): void {
    const clienteId = localStorage.getItem('usuarioId');
    if (!clienteId) return;

    const cacheKey = `solicitacoes-cliente-${clienteId}`;
    const cache = localStorage.getItem(cacheKey);
    if (!cache) return;

    try {
      const solicitacoes = JSON.parse(cache);
      if (!Array.isArray(solicitacoes)) return;

      const atualizadas = solicitacoes.map((item: any) =>
        Number(item.id) === Number(solicitacaoAtualizada.id)
          ? {
              ...item,
              estado: solicitacaoAtualizada.status,
              status: solicitacaoAtualizada.status,
              valor: solicitacaoAtualizada.valorOrcado ?? item.valor,
              valorOrcado: solicitacaoAtualizada.valorOrcado,
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
