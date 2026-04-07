import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-staff-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboardComponent implements OnInit {
  nomeFuncionario: string | null = null;
  solicitacoes: any[] = [];

  private solicitacoesBase = [
    {
      id: 1,
      status: 'ABERTA',
      data: '23/03/2026, 09:30',
      categoria: 'Notebook',
      produto: 'Dell Inspiron 15 3000',
      problema: 'Notebook não liga, led piscando',
      acao: 'Efetuar Orçamento',
      cliente: {
        nome: 'João Silva',
        email: 'joao@email.com',
        cpf: '123.456.789-00',
        telefone: '(41) 98765-4321',
        endereco: 'Rua das Flores, 100 - Curitiba, PR'
      }
    },
    {
      id: 2,
      status: 'ABERTA',
      data: '23/03/2026, 10:45',
      categoria: 'Console',
      produto: 'PlayStation 5 - Barulho no Cooler',
      problema: 'Barulho excessivo no cooler ao iniciar jogos',
      acao: 'Efetuar Orçamento',
      cliente: {
        nome: 'Carlos Alberto',
        email: 'carlos@email.com',
        cpf: '222.333.444-55',
        telefone: '(41) 99988-7766',
        endereco: 'Av. Sete de Setembro, 500 - Curitiba, PR'
      }
    },
    {
      id: 3,
      status: 'ABERTA',
      data: '22/03/2026, 11:00',
      categoria: 'Placa Mãe',
      produto: 'Placa Mãe Asus B450',
      problema: 'Não reconhece memória no slot 2',
      acao: 'Efetuar Orçamento',
      cliente: {
        nome: 'Lucas Lima',
        email: 'lucas@email.com',
        cpf: '999.888.777-11',
        telefone: '(41) 91122-3344',
        endereco: 'Rua XV de Novembro, 20 - Curitiba, PR'
      }
    },
    {
      id: 4,
      status: 'APROVADA',
      data: '21/03/2026, 11:00',
      categoria: 'Notebook',
      produto: 'Samsung Galaxy Book',
      problema: 'Tela com manchas escuras',
      acao: 'Efetuar Manutenção',
      valorOrcamento: 'R$ 350,00',
      cliente: {
        nome: 'João Silva',
        email: 'joao@email.com',
        cpf: '222.333.444-55',
        telefone: '(41) 98888-2222',
        endereco: 'Rua Marechal Deodoro, 50 - Curitiba, PR'
      }
    },
    {
      id: 5,
      status: 'PAGA',
      data: '20/03/2026, 09:00',
      categoria: 'Microfone',
      produto: 'Blue Yeti USB Microphone',
      problema: 'Microfone não capta áudio',
      acao: 'Finalizar Solicitação',
      valorOrcamento: 'R$ 80,00',
      dataOrcamento: '20/03/2026, 10:00',
      manutencaoRealizada: 'Limpeza dos contatos USB e teste de funcionamento',
      dataManutencao: '21/03/2026, 14:00',
      orientacoesCliente: 'Evitar exposição à umidade',
      cliente: {
        nome: 'Maria Santos',
        email: 'maria@email.com',
        cpf: '987.654.321-00',
        telefone: '(11) 91234-5678',
        endereco: 'Rua das Flores, 120 - São Paulo, SP'
      }
    },
    {
      id: 7,
      status: 'REDIRECIONADA',
      data: '22/03/2026, 16:00',
      categoria: 'Impressora',
      produto: 'Epson EcoTank L3150',
      problema: 'Impressora não imprime preto',
      acao: 'Ver Detalhes',
      cliente: {
        nome: 'João Silva',
        email: 'joao@email.com',
        cpf: '123.123.123-12',
        telefone: '(41) 95555-1122',
        endereco: 'Rua Chile, 44 - Curitiba, PR'
      }
    }
  ];

  ngOnInit(): void {
    // pega o nome do usuário logado do localStorage do login 
    this.nomeFuncionario = localStorage.getItem('nomeUsuario');
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    const salvas = localStorage.getItem('listaSolicitacoes');

    if (salvas) {
      const listaCompleta = JSON.parse(salvas);
      this.solicitacoes = listaCompleta.filter((item: any) => item.status === 'ABERTA');
      return;
    }

    localStorage.setItem('listaSolicitacoes', JSON.stringify(this.solicitacoesBase));
    this.solicitacoes = this.solicitacoesBase.filter(item => item.status === 'ABERTA');
  }

  efetuarOrcamento(solicitacao: any) {
    console.log('Orçando para:', solicitacao.cliente.nome);
  }
}