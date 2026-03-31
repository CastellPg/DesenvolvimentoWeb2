import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-receitas-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receitas-categorias.html',
  styleUrl: './receitas-categorias.css'
})
export class ReceitasCategoriaComponent {
  
  // Dados apenas para exemplo para a apresentação da tela
resumo = {
    totalCategorias: 4,
    totalSolicitacoes: 8,
    receitaTotal: 8450.00
  };

  categorias = [
    { nome: 'Notebook', quantidade: 2, valorTotal: 4500.00, percentual: 53.2 },
    { nome: 'Desktop', quantidade: 2, valorTotal: 2800.00, percentual: 33.1 },
    { nome: 'Impressora', quantidade: 2, valorTotal: 850.00, percentual: 10.0 },
    { nome: 'Teclado', quantidade: 2, valorTotal: 300.00, percentual: 3.7 }
  ];

  // meotodo para gerar o PDF porem ainda é algo provisorio, sendo apenas um modelo base, quando for integrar com o backend tera q ser refeito e ai sim sera o definitivo
  gerarPdf() {
   
    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
  
    doc.text('Relatório de Receitas por Categoria', 15, 20);

    doc.setFontSize(12);
    doc.text('Período: Desde sempre', 15, 30);

    doc.setFontSize(11);
    doc.text('Categoria', 15, 50);
    doc.text('Qtd', 105, 50, { align: 'center' });
    doc.text('Valor Total', 195, 50, { align: 'right' });

    doc.setLineWidth(0.5);
    doc.line(15, 53, 195, 53);

    let yAtual = 63;
    doc.setFont('helvetica', 'normal');

    this.categorias.forEach(cat => {
      // Nome
      doc.text(cat.nome, 15, yAtual);
      
      // Quantidade 
      doc.text(cat.quantidade.toString(), 105, yAtual, { align: 'center' });
      
      const valorFormatado = cat.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      doc.text(valorFormatado, 195, yAtual, { align: 'right' });

      yAtual += 10; 
    });

    doc.line(15, yAtual, 195, yAtual);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 15, yAtual + 7);

    doc.text(this.resumo.totalSolicitacoes.toString(), 105, yAtual + 7, { align: 'center' });

    const totalFormatado = this.resumo.receitaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    doc.text(totalFormatado, 195, yAtual + 7, { align: 'right' });

    doc.save('relatorio_receitas.pdf');
  }
}