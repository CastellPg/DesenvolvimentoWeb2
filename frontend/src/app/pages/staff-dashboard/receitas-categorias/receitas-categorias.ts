import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(private relatorioService: RelatorioReceitaService) {}

  ngOnInit(): void {
    this.carregarRelatorio();
  }

  carregarRelatorio(): void {
    this.erro = '';
    this.carregando = true;

    this.relatorioService.buscarPorCategoria().subscribe({
      next: (resposta) => {
        this.categorias = resposta.data;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar relatório por categoria.';
        this.carregando = false;
      }
    });
  }

  gerarPdf(): void {
    this.relatorioService.gerarPdfPorCategoria().subscribe({
      next: (arquivo) => {
        this.baixarPdf(arquivo, 'relatorio-receitas-categorias.pdf');
      },
      error: () => {
        this.erro = 'Erro ao gerar PDF por categoria.';
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
}