import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { SolicitacaoResponse, SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './visualizar-servico.html',
  styleUrls: ['./visualizar-servico.css']
})
export class VisualizarServicoComponent implements OnInit {
  solicitacao: any;
  carregando = false;
  erro: string | null = null;
  mostrarToast = false;
  mensagemToast = '';

  constructor(
    private route: ActivatedRoute,
    private solicitacaoService: SolicitacaoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.erro = 'Solicitacao nao informada na rota.';
      return;
    }

    this.buscarDados(id);
  }

  buscarDados(idUrl: string | number): void {
    this.carregando = true;
    this.erro = null;

    this.solicitacaoService.buscarPorId(idUrl)
      .pipe(
        timeout(10000),
        finalize(() => this.carregando = false)
      )
      .subscribe({
        next: (dados) => this.solicitacao = this.converterSolicitacao(dados),
        error: (err) => this.erro = this.extrairMensagemErro(err)
      });
  }

  resgatarServico(): void {
    this.mensagemToast = 'Resgate de servico ainda nao foi integrado ao backend.';
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

  private converterSolicitacao(solicitacao: SolicitacaoResponse) {
    return {
      id: solicitacao.id,
      dataHora: solicitacao.dataCriacao,
      equipamento: solicitacao.descricaoEquipamento,
      categoria: solicitacao.categoria,
      estado: solicitacao.status,
      valor: solicitacao.valorOrcado,
      descricaoDefeito: solicitacao.descricaoDefeito,
      motivoRejeicao: solicitacao.motivoRejeicao,
      historico: []
    };
  }

  private extrairMensagemErro(err: any): string {
    if (err?.name === 'TimeoutError') {
      return 'Backend demorou demais para responder ao buscar a solicitacao.';
    }

    if (err?.status === 0) {
      return 'Nao foi possivel conectar ao backend em http://localhost:8080.';
    }

    return err?.error?.messages?.join(' | ') || err?.error?.message || 'Nao foi possivel carregar a solicitacao.';
  }
}
