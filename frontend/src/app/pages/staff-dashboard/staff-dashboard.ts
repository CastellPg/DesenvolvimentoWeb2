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
  private funcionarioId: number | null = null;

  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.nomeFuncionario = localStorage.getItem('nomeUsuario');
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    const funcionarioId = Number(localStorage.getItem('usuarioId'));
    if (!funcionarioId) return;

    this.funcionarioId = funcionarioId;
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
        this.salvarSolicitacoesNoCache(lista);
        this.cdr.detectChanges();
      },
    });
  }

  getStatusLabel(status: string): string {
    return status === 'ORCADA' ? 'ORÇADA' : status;
  }

  private salvarSolicitacoesNoCache(lista: SolicitacaoResponse[]): void {
    if (!this.funcionarioId) return;

    const solicitacoesCache = lista.map((solicitacao) => ({
      id: solicitacao.id,
      status: solicitacao.status,
      dataOriginal: solicitacao.dataCriacao,
      dataCriacao: solicitacao.dataCriacao,
      categoria: solicitacao.categoria || '-',
      produto: solicitacao.descricaoEquipamento || '-',
      descricaoEquipamento: solicitacao.descricaoEquipamento || '-',
      problema: solicitacao.descricaoDefeito || '-',
      descricaoDefeito: solicitacao.descricaoDefeito || '-',
      valorOrcado: solicitacao.valorOrcado,
      valorPago: solicitacao.valorPago,
      dataHoraPagamento: solicitacao.dataHoraPagamento,
      pagamentoDivergente: solicitacao.pagamentoDivergente,
      motivoRejeicao: solicitacao.motivoRejeicao,
      cliente: solicitacao.cliente ?? null,
    }));

    localStorage.setItem(`solicitacoes-funcionario-${this.funcionarioId}`, JSON.stringify(solicitacoesCache));
  }

}
