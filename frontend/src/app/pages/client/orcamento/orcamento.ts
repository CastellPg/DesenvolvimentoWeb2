import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orcamento.html'
})
export class OrcamentoComponent implements OnInit {

  orcamento: any;
  solicitacaoId: string | null = null;

  // -variaveis das modais
  mostrarModalAprovar: boolean = false;
  mostrarModalRejeitar: boolean = false;

  // variaveis do toast
  toastVisivel: boolean = false;
  toastMensagem: string = '';
  toastTipo: 'success' | 'danger' = 'success';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.solicitacaoId = this.route.snapshot.paramMap.get('id');
    if (this.solicitacaoId) {
      this.buscarDados(this.solicitacaoId);
    }
  }

  buscarDados(id: string) {
    const dados = localStorage.getItem('banco_dados_v1');
    if (dados) {
      const banco = JSON.parse(dados);
      const itemEncontrado = banco.find((item: any) => String(item.id) === String(id));
      if (itemEncontrado) {
        this.orcamento = itemEncontrado;
      }
    }
  }

  // modais
  abrirModalAprovar() { this.mostrarModalAprovar = true; }
  fecharModalAprovar() { this.mostrarModalAprovar = false; }

  abrirModalRejeitar() { this.mostrarModalRejeitar = true; }
  fecharModalRejeitar() { this.mostrarModalRejeitar = false; }

  exibirToast(mensagem: string, tipo: 'success' | 'danger') {
    this.toastMensagem = mensagem;
    this.toastTipo = tipo;
    this.toastVisivel = true;
    setTimeout(() => { this.toastVisivel = false; }, 3500);
  }

  confirmarAprovacao() {
    this.atualizarLocalStorage('APROVADA', 'Orçamento aprovado pelo cliente via painel.');
    this.fecharModalAprovar();
    this.exibirToast('Serviço Aprovado com sucesso! Iniciando manutenção...', 'success');
  }

  confirmarRejeicao(motivoDigitado: string) {
    if (motivoDigitado && motivoDigitado.trim() !== '') {
      this.atualizarLocalStorage('REJEITADA', `Orçamento rejeitado. Motivo: ${motivoDigitado}`);
      this.fecharModalRejeitar();
      this.exibirToast('Serviço Rejeitado com sucesso. O equipamento será devolvido.', 'success');
    } else {
      this.exibirToast('Atenção: É obrigatório informar um motivo para rejeitar!', 'danger');
    }
  }

  // LOCALSTORAGE
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
      }
    }
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'ABERTA': return 'bg-secondary';
      case 'ORÇADA': return 'bg-marrom';
      case 'REJEITADA': return 'bg-danger';
      case 'APROVADA': return 'bg-warning text-dark';
      case 'ARRUMADA': return 'bg-primary';
      case 'PAGA': return 'bg-laranja';
      case 'FINALIZADA': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}
