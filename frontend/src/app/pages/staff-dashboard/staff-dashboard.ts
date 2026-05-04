import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitacaoService, SolicitacaoResponse } from '../../services/solicitacao.service';

@Component({
  selector: 'app-staff-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboardComponent implements OnInit {
  nomeFuncionario: string | null = null;
  solicitacoes: SolicitacaoResponse[] = [];
  carregando = false;

  private readonly solicitacaoService = inject(SolicitacaoService);

  ngOnInit(): void {
    this.nomeFuncionario = localStorage.getItem('nomeUsuario');
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    const funcionarioId = Number(localStorage.getItem('usuarioId'));
    if (!funcionarioId) return;

    this.carregando = true;
    this.solicitacaoService.listarPorFuncionario(funcionarioId).subscribe({
      next: (lista) => {
        this.solicitacoes = lista.filter(s => s.status === 'ABERTA');
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'ABERTA': return 'bg-secondary';
      case 'ORCADA': return 'bg-warning text-dark';
      case 'APROVADA': return 'bg-warning text-dark';
      case 'REJEITADA': return 'bg-danger';
      case 'REDIRECIONADA': return 'bg-purple text-white';
      case 'ARRUMADA': return 'bg-primary';
      case 'PAGA': return 'bg-orange text-dark';
      case 'FINALIZADA': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}