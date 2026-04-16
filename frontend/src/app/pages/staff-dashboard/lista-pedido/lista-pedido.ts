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
      }
    });
  }

  limparStatusSalvos() {
    this.carregarSolicitacoesDoFuncionario();
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
        if (!resposta) {
          this.carregando = false;
          this.cdr.detectChanges();
          return;
        }

        this.atualizarSolicitacoes(resposta);
        this.carregando = false;
        this.cdr.detectChanges();
      });
  }

  onFiltroChange() {
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
      return this.solicitacoes.filter(s => {
        const dataSolicitacao = new Date(s.dataOriginal);
        return this.mesmaData(dataSolicitacao, hoje);
      });
    }

    if (this.filtroSelecionado === 'periodo') {
      if (!this.dataInicio && !this.dataFim) {
        return this.solicitacoes;
      }

      return this.solicitacoes.filter(s => {
        const dataSolicitacao = new Date(s.dataOriginal);
        let dentroDoPeriodo = true;

        if (this.dataInicio) {
          const inicio = new Date(this.dataInicio + 'T00:00:00');
          if (dataSolicitacao < inicio) dentroDoPeriodo = false;
        }

        if (this.dataFim) {
          const fim = new Date(this.dataFim + 'T23:59:59');
          if (dataSolicitacao > fim) dentroDoPeriodo = false;
        }

        return dentroDoPeriodo;
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
      case 'ABERTA':
        return 'os-card-aberta';
      case 'PAGA':
        return 'os-card-paga';
      case 'APROVADA':
        return 'os-card-aprovada';
      case 'ORCADA':
        return 'os-card-orcada';
      case 'REDIRECIONADA':
        return 'os-card-redirecionada';
      case 'ARRUMADA':
        return 'os-card-arrumada';
      case 'FINALIZADA':
        return 'os-card-finalizada';
      default:
        return '';
    }
  }

  getClasseBadge(status: StatusSolicitacao): string {
    switch (status) {
      case 'ABERTA':
        return 'os-badge-aberta';
      case 'PAGA':
        return 'os-badge-paga';
      case 'APROVADA':
        return 'os-badge-aprovada';
      case 'ORCADA':
        return 'os-badge-orcada';
      case 'REDIRECIONADA':
        return 'os-badge-redirecionada';
      case 'ARRUMADA':
        return 'os-badge-arrumada';
      case 'FINALIZADA':
        return 'os-badge-finalizada';
      default:
        return '';
    }
  }

  getClasseIndicador(status: StatusSolicitacao): string {
    switch (status) {
      case 'ARRUMADA':
        return 'os-indicador-arrumada';
      case 'FINALIZADA':
        return 'os-indicador-finalizada';
      default:
        return 'os-indicador-neutro';
    }
  }

  private carregarSolicitacoesDoCache(): void {
    const solicitacoesEmCache = localStorage.getItem(this.cacheKey);

    if (!solicitacoesEmCache) {
      return;
    }

    try {
      this.solicitacoes = this.ordenarSolicitacoes(JSON.parse(solicitacoesEmCache));
    } catch {
      localStorage.removeItem(this.cacheKey);
    }
  }

  private salvarSolicitacoesNoCache(): void {
    localStorage.setItem(this.cacheKey, JSON.stringify(this.solicitacoes));
  }

  private atualizarSolicitacoes(resposta: SolicitacaoResponse[]): void {
    this.solicitacoes = this.ordenarSolicitacoes(
      resposta.map((solicitacao) => this.converterSolicitacao(solicitacao))
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
      case 'ABERTA':
        return 'Efetuar Orcamento';
      case 'APROVADA':
      case 'REDIRECIONADA':
        return 'Efetuar Manutencao';
      case 'ORCADA':
        return 'Aguardando Resposta';
      case 'ARRUMADA':
        return 'Aguardando Pagamento';
      case 'PAGA':
        return 'Finalizar Solicitacao';
      case 'FINALIZADA':
        return 'Concluida';
      default:
        return '';
    }
  }
}
