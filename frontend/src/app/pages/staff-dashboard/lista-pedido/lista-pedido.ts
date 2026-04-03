import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type StatusSolicitacao =
  | 'ABERTA'
  | 'PAGA'
  | 'APROVADA'
  | 'EM MANUTENÇÃO'
  | 'ORÇADA'
  | 'REDIRECIONADA'
  | 'FINALIZADA';

type TipoFiltroData = 'todas' | 'hoje' | 'periodo';

interface Cliente {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

interface Solicitacao {
  id: number;
  status: StatusSolicitacao;
  data: string;
  cliente: Cliente;
  categoria: string;
  produto: string;
  problema: string;
  acao: string;
  valorOrcamento?: string;
  dataOrcamento?: string;
  manutencaoRealizada?: string;
  dataManutencao?: string;
  orientacoesCliente?: string;
}

@Component({
  selector: 'app-lista-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-pedido.html',
  styleUrl: './lista-pedido.css',
})
export class ListaPedidoComponent implements OnInit {
  filtroSelecionado: TipoFiltroData = 'todas';
  dataInicio = '';
  dataFim = '';

  solicitacoes: Solicitacao[] = [];

  private baseSolicitacoes: Solicitacao[] = [
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
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    const salvas = localStorage.getItem('listaSolicitacoes');

    if (salvas) {
      this.solicitacoes = JSON.parse(salvas);
    } else {
      this.solicitacoes = [...this.baseSolicitacoes];
      this.salvarSolicitacoes();
    }
  }

  salvarSolicitacoes(): void {
    localStorage.setItem('listaSolicitacoes', JSON.stringify(this.solicitacoes));
  }

  limparStatusSalvos() {
    localStorage.removeItem('listaSolicitacoes');
    this.solicitacoes = [...this.baseSolicitacoes];
    this.salvarSolicitacoes();
    window.location.reload();
  }

  onFiltroChange() {
    if (this.filtroSelecionado !== 'periodo') {
      this.dataInicio = '';
      this.dataFim = '';
    }
  }

  get solicitacoesFiltradas(): Solicitacao[] {
    if (this.filtroSelecionado === 'todas') {
      return this.solicitacoes;
    }

    if (this.filtroSelecionado === 'hoje') {
      const hoje = new Date();
      return this.solicitacoes.filter(s => {
        const dataSolicitacao = this.converterDataStringParaDate(s.data);
        return this.mesmaData(dataSolicitacao, hoje);
      });
    }

    if (this.filtroSelecionado === 'periodo') {
      if (!this.dataInicio && !this.dataFim) {
        return this.solicitacoes;
      }

      return this.solicitacoes.filter(s => {
        const dataSolicitacao = this.converterDataStringParaDate(s.data);
        let dentroDoPeriodo = true;

        if (this.dataInicio) {
          const inicio = new Date(this.dataInicio + 'T00:00:00');
          if (dataSolicitacao < inicio) dentroDoPeriodo = false;
        }

        if (this.dataFim) {
          const fim = new Date(this.dataFim + 'T23:59:59');
          if (dataSolicitacao > fim) dentroDoPeriodo = false;
        }

        return dentroDoPeriodo;
      });
    }

    return this.solicitacoes;
  }

  converterDataStringParaDate(dataString: string): Date {
    const [dataParte, horaParte] = dataString.split(', ');
    const [dia, mes, ano] = dataParte.split('/').map(Number);
    const [hora, minuto] = horaParte.split(':').map(Number);

    return new Date(ano, mes - 1, dia, hora, minuto);
  }

  mesmaData(data1: Date, data2: Date): boolean {
    return (
      data1.getDate() === data2.getDate() &&
      data1.getMonth() === data2.getMonth() &&
      data1.getFullYear() === data2.getFullYear()
    );
  }

  getClasseCard(status: StatusSolicitacao): string {
    switch (status) {
      case 'ABERTA':
        return 'os-card-aberta';
      case 'PAGA':
        return 'os-card-paga';
      case 'APROVADA':
        return 'os-card-aprovada';
      case 'EM MANUTENÇÃO':
        return 'os-card-manutencao';
      case 'ORÇADA':
        return 'os-card-orcada';
      case 'REDIRECIONADA':
        return 'os-card-redirecionada';
      case 'FINALIZADA':
        return 'os-card-finalizada';
      default:
        return '';
    }
  }

  getClasseBadge(status: StatusSolicitacao): string {
    switch (status) {
      case 'ABERTA':
        return 'os-badge-aberta';
      case 'PAGA':
        return 'os-badge-paga';
      case 'APROVADA':
        return 'os-badge-aprovada';
      case 'EM MANUTENÇÃO':
        return 'os-badge-manutencao';
      case 'ORÇADA':
        return 'os-badge-orcada';
      case 'REDIRECIONADA':
        return 'os-badge-redirecionada';
      case 'FINALIZADA':
        return 'os-badge-finalizada';
      default:
        return '';
    }
  }

  getClasseIndicador(status: StatusSolicitacao): string {
    switch (status) {
      case 'FINALIZADA':
        return 'os-indicador-finalizada';
      default:
        return 'os-indicador-neutro';
    }
  }
}