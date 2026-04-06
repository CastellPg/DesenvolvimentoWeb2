import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

declare var bootstrap: any;

export interface SolicitacaoOrcamento {
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
  selector: 'app-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orcamento.html',
  styleUrls: ['./orcamento.css']
})
export class OrcamentoComponent implements OnInit {
  solicitacaoId!: number;
  orcamento!: SolicitacaoOrcamento;
  mensagemToast: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.solicitacaoId = Number(this.route.snapshot.paramMap.get('id'));
    this.buscarOrcamento(this.solicitacaoId);
  }

  mostrarToast(mensagem: string) {
    this.mensagemToast = mensagem;
    const toastElement = document.getElementById('avisoSucesso');
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
      toast.show();
    }
  }

  //LocalStorage
  buscarOrcamento(id: number) {
    const dados = localStorage.getItem('banco_dados_v1');
    if (dados) {
      const banco = JSON.parse(dados);
      this.orcamento = banco.find((item: any) => Number(item.id) === id);
    }
  }

  private atualizarLocalStorage(novoEstado: string, motivoHistorico: string) {
    const dados = localStorage.getItem('banco_dados_v1');
    if (dados) {
      let banco = JSON.parse(dados);

      const index = banco.findIndex((item: any) => String(item.id) === String(this.solicitacaoId));

      if (index !== -1) {
        banco[index].estado = novoEstado;

        if (!banco[index].historico) banco[index].historico = [];
        banco[index].historico.push({
          dataHora: new Date().toISOString(),
          estadoNovo: novoEstado,
          descricao: motivoHistorico,
          funcionario: 'Cliente (João)'
        });

        localStorage.setItem('banco_dados_v1', JSON.stringify(banco));

        if (this.orcamento) this.orcamento.estado = novoEstado;

        console.log("SUCESSO: Salvo no LocalStorage!", banco[index]);
      } else {
        console.error("ERRO: ID não encontrado no banco:", this.solicitacaoId);
      }
    }
  }

  // RF006 - APROVAÇÃO
  aprovarServico(): void {
    const confirmacao = window.confirm(`Deseja realmente aprovar este serviço no valor de R$ ${this.orcamento.valor.toFixed(2).replace('.', ',')}?`);

    if (confirmacao) {
      this.atualizarLocalStorage('APROVADA', 'Orçamento aprovado pelo cliente via painel.');

      this.mostrarToast(`Serviço Aprovado no Valor de R$ ${this.orcamento.valor.toFixed(2).replace('.', ',')}`);

      setTimeout(() => {
        this.router.navigate(['/client/dashboard']);
      }, 2000);
    }
  }

  // RF007 - REJEIÇÃO
  rejeitarServico(): void {
    const motivo = window.prompt('Por favor, informe o motivo da rejeição:');

    if (motivo !== null && motivo.trim() !== '') {
      this.atualizarLocalStorage('REJEITADA', `Orçamento rejeitado. Motivo: ${motivo}`);

      alert('Serviço Rejeitado com sucesso.');
      this.router.navigate(['/client/dashboard']);
    } else if (motivo !== null) {
      alert('É obrigatório informar um motivo para rejeitar o orçamento.');
    }
  }
}
