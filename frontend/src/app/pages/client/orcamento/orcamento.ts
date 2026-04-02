import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

export interface SolicitacaoOrcamento {
  id: number;
  dataHora: string;
  equipamento: string;
  categoria: string;
  descricaoDefeito: string;
  estado: string;
  valor: number;
}

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orcamento.html',
  styleUrls: ['./orcamento.css']
})
export class OrcamentoComponent implements OnInit {
  solicitacaoId!: number;
  orcamento!: SolicitacaoOrcamento;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.solicitacaoId = Number(this.route.snapshot.paramMap.get('id'));
    this.buscarOrcamento(this.solicitacaoId);
  }

  // Simulação da busca de dados
  buscarOrcamento(id: number) {
    this.orcamento = {
      id: id,
      dataHora: '2026-03-20T14:30:00',
      equipamento: 'Notebook Dell Inspiron 15 3000',
      categoria: 'Informática',
      descricaoDefeito: 'Tela não liga, provável problema no display ou cabo flat.',
      estado: 'ORÇADA',
      valor: 450.00
    };
  }

  // RF006
  aprovarServico(): void {
    const confirmacao = window.confirm(`Deseja realmente aprovar este serviço no valor de R$ ${this.orcamento.valor.toFixed(2).replace('.', ',')}?`);

    if (confirmacao) {
      console.log('Serviço Aprovado! ID:', this.orcamento.id);
      // Feedback RF006
      alert(`Serviço Aprovado no Valor de R$ ${this.orcamento.valor.toFixed(2).replace('.', ',')}`);

      // Simulação da mudança de estado e redirecionamento
      this.orcamento.estado = 'APROVADA';
      this.router.navigate(['/client/dashboard']);
    }
  }

  rejeitarServico(): void {
    // RNF08 e RF007
    const motivo = window.prompt('Por favor, informe o motivo da rejeição:');

    if (motivo !== null && motivo.trim() !== '') {
      console.log('Serviço Rejeitado. Motivo:', motivo);

      // feedback RF007
      alert('Serviço Rejeitado com sucesso.');

      // Simulação da mudança de estado e redirecionamento
      this.orcamento.estado = 'REJEITADA';
      this.router.navigate(['/client/dashboard']);
    } else if (motivo !== null) {
      // OK mas deixou em branco
      alert('É obrigatório informar um motivo para rejeitar o orçamento.');
    }
  }
}
