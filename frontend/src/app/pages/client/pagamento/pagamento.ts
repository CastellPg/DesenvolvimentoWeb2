import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

declare var bootstrap: any;

export interface SolicitacaoPagamento {
  id: number;
  dataHora: string;
  equipamento: string;
  categoria: string;
  descricaoDefeito: string;
  estado: string;
  valor: number;
  historico?: any[];
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
  mensagemToast: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.solicitacaoId = Number(this.route.snapshot.paramMap.get('id'));
    this.buscarServicoArrumado(this.solicitacaoId);
  }

  mostrarToast(mensagem: string) {
    this.mensagemToast = mensagem;
    const toastElement = document.getElementById('avisoSucesso');
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
      toast.show();
    }
  }

  // LocalStorage
  buscarServicoArrumado(id: number) {
    const dados = localStorage.getItem('banco_dados_v1');
    if (dados) {
      const banco = JSON.parse(dados);
      this.servico = banco.find((item: any) => Number(item.id) === id);
    }
  }

  // RF010
  confirmarPagamento(): void {
    const valorFormatado = this.servico.valor.toFixed(2).replace('.', ',');
    const confirmacao = window.confirm(`Deseja confirmar o pagamento de R$ ${valorFormatado} para este serviço?`);

    if (confirmacao) {
      const dados = localStorage.getItem('banco_dados_v1');

      if (dados) {
        let banco = JSON.parse(dados);
        const index = banco.findIndex((item: any) => Number(item.id) === this.solicitacaoId);

        if (index !== -1) {
          banco[index].estado = 'PAGA';

          if (!banco[index].historico) banco[index].historico = [];
          banco[index].historico.push({
            dataHora: new Date().toISOString(),
            estadoNovo: 'PAGA',
            descricao: 'Pagamento confirmado pelo cliente via painel.',
            funcionario: 'Sistema (Financeiro)'
          });

          localStorage.setItem('banco_dados_v1', JSON.stringify(banco));
        }
      }

      this.mostrarToast('Pagamento confirmado com sucesso! O serviço agora consta como PAGO.');

      setTimeout(() => {
        this.router.navigate(['/client/dashboard']);
      }, 2000);
    }
  }
}
