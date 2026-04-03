import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-efetuar-manutencao',
  imports: [CommonModule, RouterLink],
  templateUrl: './efetuar-manutencao.html',
  styleUrl: './efetuar-manutencao.css',
})
export class EfetuarManutencaoComponent implements OnInit {

  solicitacao: any;

  tecnicoLogado: string = 'Carlos Técnico';
  dataHoraAtual: string = '02/04/2026, 14:20:00';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const idUrl = this.route.snapshot.paramMap.get('id');
    this.carregarDadosSimulados(idUrl);
  }

  carregarDadosSimulados(id: string | null) {
    const listaSalva = JSON.parse(localStorage.getItem('listaSolicitacoes') || '[]');
    const encontrada = listaSalva.find((item: any) => item.id.toString() === id);
    this.solicitacao = encontrada || listaSalva[0];
  }

  confirmarManutencao() {
    const listaSalva = JSON.parse(localStorage.getItem('listaSolicitacoes') || '[]');

    const listaAtualizada = listaSalva.map((item: any) => {
      if (item.id.toString() === this.solicitacao.id.toString()) {
        return {
          ...item,
          status: 'EM MANUTENÇÃO',
          acao: 'Finalizar Solicitação'
        };
      }
      return item;
    });

    localStorage.setItem('listaSolicitacoes', JSON.stringify(listaAtualizada));

    this.mostrarAviso('Manutenção iniciada com sucesso!');

    setTimeout(() => {
      this.router.navigate(['/solicitacoes']);
    }, 2000);
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