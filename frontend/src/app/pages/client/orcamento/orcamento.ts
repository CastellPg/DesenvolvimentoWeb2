import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SolicitacaoService, SolicitacaoResponse } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orcamento.html'
})
export class OrcamentoComponent implements OnInit {

  orcamento: SolicitacaoResponse | null = null;
  solicitacaoId: string | null = null;
  carregando = true;
  erroCarregamento: string | null = null;

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
    this.solicitacaoService.buscarPorId(id).subscribe({
      next: (dados) => {
        this.orcamento = dados;
        this.carregando = false;
      },
      error: () => {
        this.erroCarregamento = 'Não foi possível carregar os dados da solicitação.';
        this.carregando = false;
      }
    });
  }

  getBadgeClass(status: string): string {
    // RF013 — escala de cores obrigatória
    switch (status) {
      case 'ABERTA':         return 'bg-secondary';
      case 'ORCADA':         return 'bg-marrom';
      case 'APROVADA':       return 'bg-warning text-dark';
      case 'REJEITADA':      return 'bg-danger';
      case 'REDIRECIONADA':  return 'bg-roxo';
      case 'ARRUMADA':       return 'bg-primary';
      case 'PAGA':           return 'bg-laranja';
      case 'FINALIZADA':     return 'bg-success';
      default:               return 'bg-secondary';
    }
  }
}