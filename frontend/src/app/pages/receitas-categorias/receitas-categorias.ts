import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  gerarPdf() {
    alert('A geração do arquivo PDF será implementada na integração com o backend.');
  }
}