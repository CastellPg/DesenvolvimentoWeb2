import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize, timeout } from 'rxjs';
import {
  ReceitaPorCategoria,
  RelatorioReceitaService
} from '../../../services/relatorio-receitas.service';

@Component({
  selector: 'app-receitas-categorias',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
  templateUrl: './receitas-categorias.html',
  styleUrl: './receitas-categorias.css'
})
export class ReceitasCategoriaComponent implements OnInit {
  categorias: ReceitaPorCategoria[] = [];

  erro = '';
  carregando = false;

  constructor(
    private relatorioService: RelatorioReceitaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarRelatorio();
  }

  carregarRelatorio(): void {
    this.erro = '';
    this.carregando = true;
    this.cdr.detectChanges();

    this.relatorioService.buscarPorCategoria().pipe(
      timeout(10000),
      finalize(() => {
        this.carregando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.erro = this.extrairMensagemErro(erro, 'Erro ao carregar relatório por categoria.');
        this.categorias = [];
        this.cdr.detectChanges();
      }
    });
  }

  gerarPdf(): void {
    this.relatorioService.gerarPdfPorCategoria().subscribe({
      next: (arquivo) => {
        this.baixarPdf(arquivo, 'relatorio-receitas-categorias.pdf');
      },
      error: (erro) => {
        this.erro = this.extrairMensagemErro(erro, 'Erro ao gerar PDF por categoria.');
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
