import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription, of, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SolicitacaoResponse, SolicitacaoService } from '../../../services/solicitacao.service';

type StatusSolicitacao =
  | 'ABERTA'
  | 'PAGA'
  | 'APROVADA'
  | 'ORCADA'
  | 'REJEITADA'
  | 'REDIRECIONADA'
  | 'ARRUMADA'
  | 'FINALIZADA';

type TipoFiltroData = 'todas' | 'hoje' | 'periodo';

interface Cliente {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

interface Solicitacao {
  id: number;
  status: StatusSolicitacao;
  data: string;
  dataOriginal: string;
  cliente: Cliente;
  categoria: string;
  produto: string;
  problema: string;
  acao: string;
  valorOrcamento?: string;
}

@Component({
  selector: 'app-lista-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-pedido.html',
  styleUrl: './lista-pedido.css',
})
export class ListaPedidoComponent implements OnInit, OnDestroy {
  filtroSelecionado: TipoFiltroData = 'todas';
  dataInicio = '';
  dataFim = '';
  carregando = false;
  solicitacoes: Solicitacao[] = [];

  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly cdr = inject(ChangeDetectorRef);
  private cacheKey = '';
  private atualizadorAutomatico: Subscription | null = null;

  ngOnInit(): void {
    const funcionarioId = Number(localStorage.getItem('usuarioId'));

    if (!funcionarioId) {
      alert('Erro de sessao. Faca login novamente.');
      return;
    }

    this.cacheKey = `solicitacoes-funcionario-${funcionarioId}`;
    this.carregarSolicitacoesDoCache();
    this.carregando = this.solicitacoes.length === 0;
    this.iniciarAtualizacaoAutomatica(funcionarioId);
  }

  ngOnDestroy(): void {
    this.atualizadorAutomatico?.unsubscribe();
  }

  carregarSolicitacoesDoFuncionario(usarCache = true): void {
    const funcionarioId = Number(localStorage.getItem('usuarioId'));

    if (!funcionarioId) {
      alert('Erro de sessao. Faca login novamente.');
      return;
    }

    this.cacheKey = `solicitacoes-funcionario-${funcionarioId}`;
    if (usarCache) {
      this.carregarSolicitacoesDoCache();
    }

    this.carregando = this.solicitacoes.length === 0;
    this.solicitacaoService.listarPorFuncionario(funcionarioId).subscribe({
      next: (resposta) => {
        this.atualizarSolicitacoes(resposta);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        if (usarCache) {
          alert('Nao foi possivel carregar as solicitacoes do funcionario.');
        }
        this.cdr.detectChanges();
      }
    });
  }

  limparStatusSalvos(): void {
    this.carregarSolicitacoesDoFuncionario(false);
  }

  onFiltroChange(): void {
    if (this.filtroSelecionado !== 'periodo') {
      this.dataInicio = '';
      this.dataFim = '';
    }
  }

  get solicitacoesFiltradas(): Solicitacao[] {
    if (this.filtroSelecionado === 'todas') {
      return this.solicitacoes;
    }

    if (this.filtroSelecionado === 'hoje') {
      const hoje = new Date();
      return this.solicitacoes.filter(solicitacao =>
        this.mesmaData(new Date(solicitacao.dataOriginal), hoje)
      );
    }

    if (this.filtroSelecionado === 'periodo') {
      if (!this.dataInicio && !this.dataFim) {
        return this.solicitacoes;
      }

      return this.solicitacoes.filter(solicitacao => {
        const dataSolicitacao = new Date(solicitacao.dataOriginal);

        if (this.dataInicio && dataSolicitacao < new Date(`${this.dataInicio}T00:00:00`)) {
          return false;
        }

        if (this.dataFim && dataSolicitacao > new Date(`${this.dataFim}T23:59:59`)) {
          return false;
        }

        return true;
      });
    }

    return this.solicitacoes;
  }

  mesmaData(data1: Date, data2: Date): boolean {
    return (
      data1.getDate() === data2.getDate() &&
      data1.getMonth() === data2.getMonth() &&
      data1.getFullYear() === data2.getFullYear()
    );
  }

  getClasseCard(status: StatusSolicitacao): string {
    switch (status) {
      case 'ABERTA': return 'os-card-aberta';
      case 'PAGA': return 'os-card-paga';
      case 'APROVADA': return 'os-card-aprovada';
      case 'ORCADA': return 'os-card-orcada';
      case 'REDIRECIONADA': return 'os-card-redirecionada';
      case 'ARRUMADA': return 'os-card-arrumada';
      case 'FINALIZADA': return 'os-card-finalizada';
      case 'REJEITADA': return 'os-card-rejeitada';
      default: return '';
    }
  }

  getClasseBadge(status: StatusSolicitacao): string {
    switch (status) {
      case 'ABERTA': return 'os-badge-aberta';
      case 'PAGA': return 'os-badge-paga';
      case 'APROVADA': return 'os-badge-aprovada';
      case 'ORCADA': return 'os-badge-orcada';
      case 'REDIRECIONADA': return 'os-badge-redirecionada';
      case 'ARRUMADA': return 'os-badge-arrumada';
      case 'FINALIZADA': return 'os-badge-finalizada';
      case 'REJEITADA': return 'os-badge-rejeitada';
      default: return '';
    }
  }

  getClasseIndicador(status: StatusSolicitacao): string {
    switch (status) {
      case 'ARRUMADA': return 'os-indicador-arrumada';
      case 'FINALIZADA': return 'os-indicador-finalizada';
      default: return 'os-indicador-neutro';
    }
  }

  private iniciarAtualizacaoAutomatica(funcionarioId: number): void {
    this.atualizadorAutomatico = timer(0, 3000)
      .pipe(
        switchMap(() =>
          this.solicitacaoService.listarPorFuncionario(funcionarioId).pipe(
            catchError(() => of(null))
          )
        )
      )
      .subscribe((resposta) => {
        if (resposta) {
          this.atualizarSolicitacoes(resposta);
        }

        this.carregando = false;
        this.cdr.detectChanges();
      });
  }

  private carregarSolicitacoesDoCache(): void {
    const solicitacoesEmCache = localStorage.getItem(this.cacheKey);

    if (!solicitacoesEmCache) {
      return;
    }

    try {
      const solicitacoes = JSON.parse(solicitacoesEmCache);
      this.solicitacoes = Array.isArray(solicitacoes)
        ? this.ordenarSolicitacoes(solicitacoes)
        : [];
    } catch {
      localStorage.removeItem(this.cacheKey);
    }
  }

  private salvarSolicitacoesNoCache(): void {
    localStorage.setItem(this.cacheKey, JSON.stringify(this.solicitacoes));
  }

  private atualizarSolicitacoes(resposta: SolicitacaoResponse[]): void {
    const lista = Array.isArray(resposta) ? resposta : [];
    this.solicitacoes = this.ordenarSolicitacoes(
      lista.map(solicitacao => this.converterSolicitacao(solicitacao))
    );
    this.salvarSolicitacoesNoCache();
  }

  private ordenarSolicitacoes(solicitacoes: Solicitacao[]): Solicitacao[] {
    return [...solicitacoes].sort(
      (solicitacao1, solicitacao2) =>
        new Date(solicitacao2.dataOriginal).getTime() - new Date(solicitacao1.dataOriginal).getTime()
    );
  }

  private converterSolicitacao(solicitacao: SolicitacaoResponse): Solicitacao {
    const status = solicitacao.status as StatusSolicitacao;

    return {
      id: solicitacao.id,
      status,
      data: this.formatarData(solicitacao.dataCriacao),
      dataOriginal: solicitacao.dataCriacao,
      categoria: solicitacao.categoria || '-',
      produto: solicitacao.descricaoEquipamento || '-',
      problema: solicitacao.descricaoDefeito || '-',
      acao: this.definirAcao(status),
      valorOrcamento: solicitacao.valorOrcado != null
        ? solicitacao.valorOrcado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : undefined,
      cliente: {
        nome: solicitacao.cliente?.nome || '-',
        email: solicitacao.cliente?.email || '-',
        cpf: solicitacao.cliente?.cpf || '-',
        telefone: solicitacao.cliente?.telefone || '-',
        endereco: solicitacao.cliente?.endereco || '-'
      }
    };
  }

  private formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private definirAcao(status: StatusSolicitacao): string {
    switch (status) {
      case 'ABERTA': return 'Efetuar Orcamento';
      case 'APROVADA':
      case 'REDIRECIONADA': return 'Efetuar Manutencao';
      case 'ORCADA': return 'Aguardando Resposta';
      case 'ARRUMADA': return 'Aguardando Pagamento';
      case 'PAGA': return 'Finalizar Solicitacao';
      case 'FINALIZADA': return 'Concluida';
      case 'REJEITADA': return 'Rejeitada';
      default: return '';
    }
  }
}
