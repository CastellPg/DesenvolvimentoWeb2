import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { SolicitacaoService, SolicitacaoResponse } from '../../services/solicitacao.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboardComponent implements OnInit {
  nomeFuncionario: string | null = null;
  solicitacoes: SolicitacaoResponse[] = [];
  carregando = false;

  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.nomeFuncionario = localStorage.getItem('nomeUsuario');
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    const funcionarioId = Number(localStorage.getItem('usuarioId'));
    if (!funcionarioId) return;

    this.carregando = true;
    this.solicitacaoService.listarPorFuncionario(funcionarioId).pipe(
      timeout(10000),
      catchError(() => of([] as SolicitacaoResponse[])),
      finalize(() => {
        this.carregando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (lista) => {
        this.solicitacoes = lista.filter(solicitacao => solicitacao.status === 'ABERTA');
        this.cdr.detectChanges();
      },
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
