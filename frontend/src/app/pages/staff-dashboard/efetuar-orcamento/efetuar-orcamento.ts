import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-efetuar-orcamento',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './efetuar-orcamento.html',
  styleUrl: './efetuar-orcamento.css',
})
export class EfetuarOrcamentoComponent implements OnInit {
  solicitacao: any;
  formOrcamento!: FormGroup;

  tecnicoLogado: string = 'Carlos Técnico';
  dataRegistro: string = '30/03/2026, 08:34:05';
  dataHoraAtual: string = '30/03/2026, 08:34:05';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    const idUrl = this.route.snapshot.paramMap.get('id');

    this.formOrcamento = this.fb.group({
      valor: ['', [Validators.required, Validators.min(0.01)]]
    });

    this.carregarDadosSimulados(idUrl);
  }

  carregarDadosSimulados(id: string | null) {
    const listaSalva = JSON.parse(localStorage.getItem('listaSolicitacoes') || '[]');
    const encontrada = listaSalva.find((item: any) => item.id.toString() === id);
    this.solicitacao = encontrada || listaSalva[0];
  }

  confirmarOrcamento() {
    if (this.formOrcamento.valid) {
      const listaSalva = JSON.parse(localStorage.getItem('listaSolicitacoes') || '[]');

      const listaAtualizada = listaSalva.map((item: any) => {
        if (item.id.toString() === this.solicitacao.id.toString()) {
          return {
            ...item,
            status: 'ORÇADA',
            acao: 'Aguardando Resposta'
          };
        }
        return item;
      });

      localStorage.setItem('listaSolicitacoes', JSON.stringify(listaAtualizada));

      this.mostrarAviso('Orçamento confirmado com sucesso!');

      setTimeout(() => {
        this.router.navigate(['/solicitacoes']);
      }, 2000);
    }
  }

  mostrarAviso(mensagem: string) {
    const spanTexto = document.getElementById('textoAviso');
    if (spanTexto) {
      spanTexto.innerText = mensagem;
    }

    const elementoAviso = document.getElementById('avisoSucesso');
    if (elementoAviso) {
      const exibirAviso = new bootstrap.Toast(elementoAviso);
      exibirAviso.show();
    }
  }
}