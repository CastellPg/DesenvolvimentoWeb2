import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { SolicitacaoResponse, SolicitacaoService } from '../../services/solicitacao.service';

interface SolicitacaoResumo {
  id: number;
  status: string;
  data: string;
  dataOriginal?: string;
  categoria: string;
  produto: string;
  problema: string;
  acao: string;
  cliente: {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    endereco: string;
  };
}

@Component({
  selector: 'app-staff-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboardComponent implements OnInit {
  nomeFuncionario: string | null = null;
  solicitacoes: SolicitacaoResumo[] = [];
  carregando = false;
  erro: string | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.nomeFuncionario = localStorage.getItem('nomeUsuario');
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    const funcionarioId = Number(localStorage.getItem('usuarioId'));

    if (!funcionarioId) {
      this.erro = 'Sessao invalida. Faca login novamente.';
      return;
    }

    this.carregarSolicitacoesDoCache(funcionarioId);
    this.carregando = this.solicitacoes.length === 0;
    this.erro = null;
    this.cdr.detectChanges();

    this.solicitacaoService.listarPorFuncionario(funcionarioId)
      .pipe(
        timeout(8000),
        finalize(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (resposta) => {
          const abertas = resposta
            .filter((item) => item.status === 'ABERTA')
            .map((item) => this.converterSolicitacao(item));

          this.solicitacoes = abertas;
          this.salvarSolicitacoesNoCache(funcionarioId, abertas);
          this.erro = null;
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (this.solicitacoes.length === 0) {
            this.erro = this.extrairMensagemErro(err, funcionarioId);
          }
          this.cdr.detectChanges();
        }
      });
  }

  private carregarSolicitacoesDoCache(funcionarioId: number): void {
    const cache = localStorage.getItem(`solicitacoes-funcionario-${funcionarioId}`);

    if (!cache) {
      return;
    }

    try {
      this.solicitacoes = JSON.parse(cache).filter((item: SolicitacaoResumo) => item.status === 'ABERTA');
    } catch {
      localStorage.removeItem(`solicitacoes-funcionario-${funcionarioId}`);
    }
  }

  private salvarSolicitacoesNoCache(funcionarioId: number, solicitacoes: SolicitacaoResumo[]): void {
    localStorage.setItem(`solicitacoes-funcionario-${funcionarioId}`, JSON.stringify(solicitacoes));
  }

  private converterSolicitacao(solicitacao: SolicitacaoResponse): SolicitacaoResumo {
    return {
      id: solicitacao.id,
      status: solicitacao.status,
      data: new Date(solicitacao.dataCriacao).toLocaleString('pt-BR'),
      dataOriginal: solicitacao.dataCriacao,
      categoria: solicitacao.categoria || '-',
      produto: solicitacao.descricaoEquipamento || '-',
      problema: solicitacao.descricaoDefeito || '-',
      acao: 'Efetuar Orcamento',
      cliente: {
        nome: solicitacao.cliente?.nome || '-',
        email: solicitacao.cliente?.email || '-',
        cpf: solicitacao.cliente?.cpf || '-',
        telefone: solicitacao.cliente?.telefone || '-',
        endereco: solicitacao.cliente?.endereco || '-'
      }
    };
  }

  private extrairMensagemErro(err: any, funcionarioId: number): string {
    if (err?.name === 'TimeoutError') {
      return `Backend demorou demais para responder ao buscar solicitacoes do funcionario ${funcionarioId}.`;
    }

    if (err?.status === 0) {
      return 'Nao foi possivel conectar ao backend em http://localhost:8080.';
    }

    return err?.error?.messages?.join(' | ') || err?.error?.message || 'Nao foi possivel carregar as solicitacoes do funcionario.';
  }
}
