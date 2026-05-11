import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  constructor(private relatorioService: RelatorioReceitaService) {}

  ngOnInit(): void {
    this.carregarRelatorio();
    this.carregarGeral();
  }

  carregarRelatorio(): void {
    this.erro = '';
    this.carregando = true;

    this.relatorioService.buscarPorPeriodo(this.dataInicio, this.dataFim).subscribe({
      next: (resposta) => {
        this.receitas = resposta.data;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar relatório de receitas.';
        this.carregando = false;
      }
    });
  }

  carregarGeral(): void {
    this.relatorioService.buscarGeral().subscribe({
      next: (resposta) => {
        this.geral = resposta.data;
      },
      error: () => {
        this.erro = 'Erro ao carregar relatório geral.';
      }
    });
  }

  gerarPdfPeriodo(): void {
    this.relatorioService.gerarPdfPorPeriodo(this.dataInicio, this.dataFim).subscribe({
      next: (arquivo) => {
        this.baixarPdf(arquivo, 'relatorio-receitas-periodo.pdf');
      },
      error: () => {
        this.erro = 'Erro ao gerar PDF por período.';
      }
    });
  }

  gerarPdfGeral(): void {
    this.relatorioService.gerarPdfGeral().subscribe({
      next: (arquivo) => {
        this.baixarPdf(arquivo, 'relatorio-receitas-geral.pdf');
      },
      error: () => {
        this.erro = 'Erro ao gerar PDF geral.';
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