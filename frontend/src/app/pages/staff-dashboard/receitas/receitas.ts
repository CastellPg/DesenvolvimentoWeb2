import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-receitas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receitas.html',
  styleUrl: './receitas.css'
})
export class ReceitasComponent {
  dataInicio: string = '';
  dataFim: string = '';

  // Dados mokados para exemplo 
  private baseDadosReceitas: any[] = [
    { data: '2026-03-23', quantidade: 2, valorTotal: 380.00 },
    { data: '2026-03-22', quantidade: 3, valorTotal: 980.50 },
    { data: '2026-03-21', quantidade: 1, valorTotal: 350.00 },
    { data: '2026-03-20', quantidade: 2, valorTotal: 430.00 },
  ];

  get receitas(): any[] {
    return this.baseDadosReceitas;
  }

  get receitasFiltradas(): any[] {
    if (!this.dataInicio && !this.dataFim) {
      return this.baseDadosReceitas;
    }

    return this.baseDadosReceitas.filter(receita => {
      const dataReceita = receita.data;

      if (this.dataInicio && dataReceita < this.dataInicio) {
        return false;
      }

      if (this.dataFim && dataReceita > this.dataFim) {
        return false;
      }

      return true;
    });
  }

  gerarPdf() {
    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFontSize(18);
    doc.setFont('calibri', 'normal');
    doc.text('Relatório de Receitas', 15, 20);

    // Montar o periodo baseado nos filtros
    let periodo = 'Desde sempre';
    if (this.dataInicio && this.dataFim) {
      const dataInicio = new Date(this.dataInicio).toLocaleDateString('pt-BR');
      const dataFim = new Date(this.dataFim).toLocaleDateString('pt-BR');
      periodo = `${dataInicio} a ${dataFim}`;
    } else if (this.dataInicio) {
      const dataInicio = new Date(this.dataInicio).toLocaleDateString('pt-BR');
      periodo = `A partir de ${dataInicio}`;
    } else if (this.dataFim) {
      const dataFim = new Date(this.dataFim).toLocaleDateString('pt-BR');
      periodo = `Até ${dataFim}`;
    }

    doc.setFontSize(12);
    doc.text(`Período: ${periodo}`, 15, 30);

    // Cabeçalho da tabela
    doc.setFontSize(11);
    doc.text('Data', 15, 50);
    doc.text('Qtd Solicitações', 80, 50);
    doc.text('Valor Total', 195, 50, { align: 'right' });

    doc.setLineWidth(0.5);
    doc.line(15, 53, 195, 53);

    let yAtual = 63;
    doc.setFont('helvetica', 'normal');
    let totalReceitas = 0;

    // Usando os dados filtrados no PDF
    this.receitasFiltradas.forEach(receita => {
      const dataFormatada = new Date(receita.data).toLocaleDateString('pt-BR');
      doc.text(dataFormatada, 15, yAtual);

      // Quantidade de solicitações
      doc.text(receita.quantidade.toString(), 80, yAtual);

      // Valor total
      const valorFormatado = receita.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      doc.text(valorFormatado, 195, yAtual, { align: 'right' });

      totalReceitas += receita.valorTotal;
      yAtual += 10;
    });

    doc.line(15, yAtual, 195, yAtual);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 15, yAtual + 9);

    const totalFormatado = totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    doc.text(totalFormatado, 195, yAtual + 7, { align: 'right' });

    doc.save('relatorio_receitas.pdf');
  }
}