import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './visualizar-servico.html',
   styleUrls: ['./visualizar-servico.css']
})
export class VisualizarServicoComponent implements OnInit {

  solicitacao: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.buscarDados(id);
    }
  }

  buscarDados(idUrl: string | number) {
    const dados = localStorage.getItem('banco_dados_v1');

    if (dados) {
      const banco = JSON.parse(dados);
      this.solicitacao = banco.find((item: any) => String(item.id) === String(idUrl));
    }
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'ABERTA': return 'bg-secondary';
      case 'ORÇADA': return 'bg-marrom';
      case 'REJEITADA': return 'bg-danger';
      case 'APROVADA': return 'bg-warning text-dark';
      case 'REDIRECIONADA': return 'bg-roxo';
      case 'ARRUMADA': return 'bg-primary';
      case 'PAGA': return 'bg-laranja';
      case 'FINALIZADA': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

}
