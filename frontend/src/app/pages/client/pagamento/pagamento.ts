import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

export interface SolicitacaoPagamento {
  id: number;
  dataHora: string;
  equipamento: string;
  categoria: string;
  descricaoDefeito: string;
  estado: string;
  valor: number;
}

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagamento.html',
  styleUrls: ['./pagamento.css']
})
export class PagamentoComponent implements OnInit {
  solicitacaoId!: number;
  servico!: SolicitacaoPagamento;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.solicitacaoId = Number(this.route.snapshot.paramMap.get('id'));
    this.buscarServicoArrumado(this.solicitacaoId);
  }

  // Simulação da busca de dados
  buscarServicoArrumado(id: number) {
    this.servico = {
      id: id,
      dataHora: '2026-03-26T10:00:00',
      equipamento: 'Smartphone Samsung Galaxy S21',
      categoria: 'Celulares',
      descricaoDefeito: 'Tela quebrada após queda.',
      estado: 'ARRUMADA', // Regra de negócio: deve estar ARRUMADA
      valor: 650.00
    };
  }

  // RF010
  confirmarPagamento(): void {
    const valorFormatado = this.servico.valor.toFixed(2).replace('.', ',');
    const confirmacao = window.confirm(`Deseja confirmar o pagamento de R$ ${valorFormatado} para este serviço?`);

    if (confirmacao) {
      // registra a data/hora do pagamento
      const dataHoraPagamento = new Date().toISOString();
      console.log('Pagamento registrado em:', dataHoraPagamento);
      console.log('ID da Solicitação Paga:', this.servico.id);

      // Feedback ao usuário
      alert('Pagamento confirmado com sucesso! O serviço agora consta como PAGO.');

      // Simulação da mudança de estado e redirecionamento
      this.servico.estado = 'PAGA';
      this.router.navigate(['/client/dashboard']);
    }
  }
}
