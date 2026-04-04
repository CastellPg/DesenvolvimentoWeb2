import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-efetuar-manutencao',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './efetuar-manutencao.html',
  styleUrl: './efetuar-manutencao.css',
})
export class EfetuarManutencaoComponent implements OnInit {

  solicitacao: any;
  formManutencao!: FormGroup;

  tecnicoLogado: string = 'Carlos Técnico';
  dataHoraAtual: string = '04/04/2026, 11:59:32';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const idUrl = this.route.snapshot.paramMap.get('id');

    this.formManutencao = this.fb.group({
      descricaoManutencao: ['', Validators.required],
      orientacoesCliente: ['', Validators.required]
    });

    this.carregarDadosSimulados(idUrl);
  }

  carregarDadosSimulados(id: string | null) {
    const listaSalva = JSON.parse(localStorage.getItem('listaSolicitacoes') || '[]');
    const encontrada = listaSalva.find((item: any) => item.id.toString() === id);
    this.solicitacao = encontrada || listaSalva[0];

    if (this.solicitacao && !this.solicitacao.dataAbertura) {
      this.solicitacao.dataAbertura = this.solicitacao.data;
    }
  }

  confirmarManutencao() {
    if (this.formManutencao.valid) {
      const listaSalva = JSON.parse(localStorage.getItem('listaSolicitacoes') || '[]');

      const listaAtualizada = listaSalva.map((item: any) => {
        if (item.id.toString() === this.solicitacao.id.toString()) {
          return {
            ...item,
            status: 'ARRUMADA',
            acao: 'Aguardando Pagamento',
            manutencaoRealizada: this.formManutencao.value.descricaoManutencao,
            orientacoesCliente: this.formManutencao.value.orientacoesCliente,
            dataManutencao: this.dataHoraAtual
          };
        }
        return item;
      });

      localStorage.setItem('listaSolicitacoes', JSON.stringify(listaAtualizada));

      this.mostrarAviso('Manutenção registrada com sucesso!');

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