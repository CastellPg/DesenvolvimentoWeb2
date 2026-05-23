import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import {
  ReceitaGeral,
  ReceitaPorPeriodo,
  RelatorioReceitaService
} from '../../../services/relatorio-receitas.service';

@Component({
  selector: 'app-receitas',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './receitas.html',
  styleUrl: './receitas.css'
})
export class ReceitasComponent implements OnInit {
  dataInicio = '';
  dataFim = '';

  receitas: ReceitaPorPeriodo[] = [];
  geral?: ReceitaGeral;

  erro = '';
  carregando = false;
  carregandoGeral = false;

  constructor(
    private relatorioService: RelatorioReceitaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarRelatorio();
    this.carregarGeral();
  }

  carregarRelatorio(): void {
    this.erro = '';
    this.carregando = true;
    this.cdr.detectChanges();

    this.relatorioService.buscarPorPeriodo(this.dataInicio, this.dataFim).pipe(
      timeout(10000),
      finalize(() => {
        this.carregando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (receitas) => {
        this.receitas = receitas;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.erro = this.extrairMensagemErro(erro, 'Erro ao carregar relatório de receitas.');
        this.receitas = [];
        this.cdr.detectChanges();
      }
    });
  }

  carregarGeral(): void {
    this.carregandoGeral = true;
    this.cdr.detectChanges();

    this.relatorioService.buscarGeral().pipe(
      timeout(10000),
      finalize(() => {
        this.carregandoGeral = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (geral) => {
        this.geral = geral;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.erro = this.extrairMensagemErro(erro, 'Erro ao carregar relatório geral.');
        this.cdr.detectChanges();
      }
    });
  }

  gerarPdfPeriodo(): void {
    this.relatorioService.gerarPdfPorPeriodo(this.dataInicio, this.dataFim).subscribe({
      next: (arquivo) => {
        this.baixarPdf(arquivo, 'relatorio-receitas-periodo.pdf');
      },
      error: (erro) => {
        this.erro = this.extrairMensagemErro(erro, 'Erro ao gerar PDF por período.');
      }
    });
  }

  gerarPdfGeral(): void {
    this.relatorioService.gerarPdfGeral().subscribe({
      next: (arquivo) => {
        this.baixarPdf(arquivo, 'relatorio-receitas-geral.pdf');
      },
      error: (erro) => {
        this.erro = this.extrairMensagemErro(erro, 'Erro ao gerar PDF geral.');
      }
    });
  }

  private baixarPdf(arquivo: Blob, nomeArquivo: string): void {
    const url = window.URL.createObjectURL(arquivo);

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  private extrairMensagemErro(erro: any, mensagemPadrao: string): string {
    if (erro?.name === 'TimeoutError') {
      return 'Backend demorou demais para responder.';
    }

    if (erro?.status === 0) {
      return 'Não foi possível conectar ao backend em http://localhost:8080.';
    }

    return erro?.error?.messages?.join(' | ') || erro?.error?.message || mensagemPadrao;
  }
}
