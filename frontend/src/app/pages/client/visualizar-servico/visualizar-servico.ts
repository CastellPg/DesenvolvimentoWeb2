import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { catchError, finalize, forkJoin, of, Subscription, timeout } from 'rxjs';
import {
  HistoricoSolicitacaoResponse,
  SolicitacaoResponse,
  SolicitacaoService
} from '../../../services/solicitacao.service';

interface HistoricoView {
  estadoNovo: string;
  dataHora: string;
  descricao: string;
  funcionario: string;
}

interface SolicitacaoView {
  id: number;
  dataHora: string;
  equipamento: string;
  categoria: string;
  estado: string;
  valor: number | null;
  descricaoDefeito: string;
  motivoRejeicao: string | null;
  historico: HistoricoView[];
}

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './visualizar-servico.html',
  styleUrls: ['./visualizar-servico.css']
})
export class VisualizarServicoComponent implements OnInit, OnDestroy {
  solicitacao: SolicitacaoView | null = null;
  carregando = false;
  erro: string | null = null;
  buscaFinalizada = false;
  mostrarToast = false;
  mensagemToast = '';
  private rotaSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private solicitacaoService: SolicitacaoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rotaSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id || id === 'undefined' || id === 'null') {
        this.solicitacao = null;
        this.carregando = false;
        this.buscaFinalizada = true;
        this.erro = 'Solicitação não informada na rota.';
        this.cdr.detectChanges();
        return;
      }

      this.buscarDados(id);
    });
  }

  ngOnDestroy(): void {
    this.rotaSubscription?.unsubscribe();
  }

  buscarDados(idUrl: string | number): void {
    this.carregando = true;
    this.erro = null;
    this.buscaFinalizada = false;
    this.solicitacao = null;
    this.carregarSolicitacaoDoCache(idUrl);
    this.cdr.detectChanges();

    forkJoin({
      solicitacao: this.solicitacaoService.buscarPorId(idUrl),
      historico: this.solicitacaoService.buscarHistorico(idUrl).pipe(
        catchError(() => of([] as HistoricoSolicitacaoResponse[]))
      )
    })
      .pipe(
        timeout(10000),
        finalize(() => {
          this.carregando = false;
          this.buscaFinalizada = true;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: ({ solicitacao, historico }) => {
          this.solicitacao = this.converterSolicitacao(solicitacao, historico);
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (!this.solicitacao) {
            this.erro = this.extrairMensagemErro(err);
          }
          this.cdr.detectChanges();
        }
      });
  }

  resgatarServico(): void {
    this.mensagemToast = 'Resgate de serviço ainda não foi integrado ao backend.';
    this.mostrarToast = true;

    setTimeout(() => {
      this.mostrarToast = false;
    }, 3000);
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

  private converterSolicitacao(
    solicitacao: SolicitacaoResponse,
    historico: HistoricoSolicitacaoResponse[] = []
  ): SolicitacaoView {
    return {
      id: solicitacao.id,
      dataHora: solicitacao.dataCriacao,
      equipamento: solicitacao.descricaoEquipamento || '-',
      categoria: solicitacao.categoria || '-',
      estado: solicitacao.status,
      valor: solicitacao.valorOrcado,
      descricaoDefeito: solicitacao.descricaoDefeito || '-',
      motivoRejeicao: solicitacao.motivoRejeicao,
      historico: historico.map((item) => ({
        estadoNovo: item.estadoNovo,
        dataHora: item.dataHora,
        descricao: this.aplicarAcentos(item.observacoes || this.descricaoHistorico(item)),
        funcionario: item.nomeResponsavel || 'Sistema'
      }))
    };
  }

  private carregarSolicitacaoDoCache(idUrl: string | number): void {
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
      const encontrada = Array.isArray(solicitacoes)
        ? solicitacoes.find((item: any) => String(item.id) === String(idUrl))
        : null;

      if (!encontrada) {
        return;
      }

      this.solicitacao = {
        id: Number(encontrada.id),
        dataHora: encontrada.dataHora || encontrada.dataCriacao || new Date().toISOString(),
        equipamento: encontrada.equipamento || encontrada.descricaoEquipamento || '-',
        categoria: encontrada.categoria || '-',
        estado: encontrada.estado || encontrada.status || '-',
        valor: encontrada.valor ?? encontrada.valorOrcado ?? null,
        descricaoDefeito: encontrada.descricaoDefeito || '-',
        motivoRejeicao: encontrada.motivoRejeicao ?? null,
        historico: []
      };
    } catch {
      localStorage.removeItem(`solicitacoes-cliente-${clienteId}`);
    }
  }

  private descricaoHistorico(item: HistoricoSolicitacaoResponse): string {
    return item.estadoAnterior
      ? `Status alterado de ${this.getStatusLabel(item.estadoAnterior)} para ${this.getStatusLabel(item.estadoNovo)}.`
      : `Status inicial: ${this.getStatusLabel(item.estadoNovo)}.`;
  }

  private aplicarAcentos(texto: string): string {
    return texto
      .replace(/\bORCAMENTO\b/g, 'ORÇAMENTO')
      .replace(/\bORCADA\b/g, 'ORÇADA')
      .replace(/\bOrcamento\b/g, 'Orçamento')
      .replace(/\borcamento\b/g, 'orçamento')
      .replace(/\bORCADA\b/g, 'ORÇADA')
      .replace(/\bServico\b/g, 'Serviço')
      .replace(/\bSERVICO\b/g, 'SERVIÇO')
      .replace(/\bservico\b/g, 'serviço')
      .replace(/\bManutencao\b/g, 'Manutenção')
      .replace(/\bMANUTENCAO\b/g, 'MANUTENÇÃO')
      .replace(/\bmanutencao\b/g, 'manutenção')
      .replace(/\bSolicitacao\b/g, 'Solicitação')
      .replace(/\bSOLICITACAO\b/g, 'SOLICITAÇÃO')
      .replace(/\bsolicitacao\b/g, 'solicitação')
      .replace(/\btecnico\b/g, 'técnico')
      .replace(/\bTecnico\b/g, 'Técnico');
  }

  private extrairMensagemErro(err: any): string {
    if (err?.name === 'TimeoutError') {
      return 'Backend demorou demais para responder ao buscar a solicitação.';
    }

    if (err?.status === 0) {
      return 'Não foi possível conectar ao backend em http://localhost:8080.';
    }

    return err?.error?.messages?.join(' | ') || err?.error?.message || 'Não foi possível carregar a solicitação.';
  }
}
