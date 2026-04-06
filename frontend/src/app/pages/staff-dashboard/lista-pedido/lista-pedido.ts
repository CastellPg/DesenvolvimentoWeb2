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
  | 'ARRUMADA'
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
  funcionarioDestino?: string;
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
      produto: 'Dell Inspiron 15',
      problema: 'Notebook não liga, led piscando',
      acao: 'Efetuar Orçamento',
      cliente: {
        nome: 'João',
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
      categoria: 'Impressora',
      produto: 'HP LaserJet Pro',
      problema: 'Impressora com erro de papel atolado',
      acao: 'Efetuar Orçamento',
      cliente: {
        nome: 'José',
        email: 'jose@email.com',
        cpf: '987.654.321-00',
        telefone: '(11) 91234-5678',
        endereco: 'Rua das Flores, 120 - São Paulo, SP'
      }
    },
    {
      id: 3,
      status: 'ORÇADA',
      data: '22/03/2026, 14:20',
      categoria: 'Desktop',
      produto: 'Lenovo ThinkCentre',
      problema: 'Desktop reiniciando sozinho',
      acao: 'Aguardando Resposta',
      valorOrcamento: 'R$ 450,00',
      dataOrcamento: '22/03/2026, 16:00',
      cliente: {
        nome: 'Joana',
        email: 'joana@email.com',
        cpf: '111.222.333-44',
        telefone: '(41) 99999-1111',
        endereco: 'Av. Brasil, 50 - Curitiba, PR'
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
      valorOrcamento: 'R$ 800,00',
      cliente: {
        nome: 'Joaquina',
        email: 'joaquina@email.com',
        cpf: '444.555.666-77',
        telefone: '(11) 98765-4321',
        endereco: 'Rua A, 123 - São Paulo, SP'
      }
    },
    {
      id: 5,
      status: 'EM MANUTENÇÃO',
      data: '21/03/2026, 08:30',
      categoria: 'Desktop',
      produto: 'PC Gamer Custom',
      problema: 'Superaquecimento em jogos',
      acao: 'Realizar Reparo',
      valorOrcamento: 'R$ 250,00',
      cliente: {
        nome: 'João',
        email: 'joao@email.com',
        cpf: '123.456.789-00',
        telefone: '(41) 98888-2222',
        endereco: 'Rua XV de Novembro, 500 - Curitiba, PR'
      }
    },
    {
      id: 6,
      status: 'ARRUMADA',
      data: '20/03/2026, 10:00',
      categoria: 'Notebook',
      produto: 'Acer Aspire 5',
      problema: 'Teclado falhando',
      acao: 'Aguardar Pagamento',
      valorOrcamento: 'R$ 350,00',
      manutencaoRealizada: 'Troca do módulo de teclado',
      dataManutencao: '21/03/2026, 15:30',
      cliente: {
        nome: 'José',
        email: 'jose@email.com',
        cpf: '987.654.321-00',
        telefone: '(41) 97777-3333',
        endereco: 'Rua Sete de Setembro, 12 - Curitiba, PR'
      }
    },
    {
      id: 7,
      status: 'PAGA',
      data: '20/03/2026, 09:00',
      categoria: 'Mouse',
      produto: 'Logitech G502',
      problema: 'Botão esquerdo com click duplo',
      acao: 'Retirar Equipamento',
      valorOrcamento: 'R$ 80,00',
      dataOrcamento: '20/03/2026, 10:00',
      manutencaoRealizada: 'Troca do switch mecânico',
      dataManutencao: '21/03/2026, 14:00',
      orientacoesCliente: 'Evitar quedas',
      cliente: {
        nome: 'Joana',
        email: 'joana@email.com',
        cpf: '111.222.333-44',
        telefone: '(11) 91234-5678',
        endereco: 'Rua das Flores, 120 - São Paulo, SP'
      }
    },
    {
      id: 8,
      status: 'REDIRECIONADA',
      data: '22/03/2026, 16:00',
      categoria: 'Impressora',
      produto: 'Epson EcoTank',
      problema: 'Impressora não imprime preto',
      acao: 'Transferir Unidade',
      funcionarioDestino: 'Técnica Maria',
      cliente: {
        nome: 'Joaquina',
        email: 'joaquina@email.com',
        cpf: '444.555.666-77',
        telefone: '(11) 98765-4321',
        endereco: 'Rua A, 123 - São Paulo, SP'
      }
    },
    {
      id: 9,
      status: 'FINALIZADA',
      data: '18/03/2026, 14:00',
      categoria: 'Teclado',
      produto: 'Teclado Mecânico',
      problema: 'Leds não acendem',
      acao: 'Arquivar Solicitação',
      valorOrcamento: 'R$ 100,00',
      manutencaoRealizada: 'Reparo na trilha da controladora',
      dataManutencao: '19/03/2026, 11:00',
      cliente: {
        nome: 'João',
        email: 'joao@email.com',
        cpf: '123.456.789-00',
        telefone: '(41) 95555-4444',
        endereco: 'Rua Itupava, 800 - Curitiba, PR'
      }
    },
    {
      id: 10,
      status: 'ABERTA',
      data: '23/03/2026, 08:00',
      categoria: 'Mouse',
      produto: 'Mouse Office Wireless',
      problema: 'Não reconhece no USB',
      acao: 'Efetuar Orçamento',
      cliente: {
        nome: 'José',
        email: 'jose@email.com',
        cpf: '987.654.321-00',
        telefone: '(41) 99999-1111',
        endereco: 'Av. Brasil, 50 - Curitiba, PR'
      }
    },
    {
      id: 11,
      status: 'EM MANUTENÇÃO',
      data: '23/03/2026, 11:30',
      categoria: 'Teclado',
      produto: 'Teclado Gamer RGB',
      problema: 'Teclas presas',
      acao: 'Limpeza Química',
      valorOrcamento: 'R$ 60,00',
      cliente: {
        nome: 'Joana',
        email: 'joana@email.com',
        cpf: '111.222.333-44',
        telefone: '(41) 98877-6655',
        endereco: 'Rua Batel, 450 - Curitiba, PR'
      }
    },
    {
      id: 12,
      status: 'ORÇADA',
      data: '19/03/2026, 10:00',
      categoria: 'Notebook',
      produto: 'Macbook Air',
      problema: 'Bateria não carrega',
      acao: 'Aguardar Aprovação',
      valorOrcamento: 'R$ 1.200,00',
      cliente: {
        nome: 'Joaquina',
        email: 'joaquina@email.com',
        cpf: '444.555.666-77',
        telefone: '(11) 97766-5544',
        endereco: 'Alameda Santos, 1000 - São Paulo, SP'
      }
    },
    {
      id: 13,
      status: 'APROVADA',
      data: '19/03/2026, 14:00',
      categoria: 'Desktop',
      produto: 'Workstation Dell',
      problema: 'Formatação e Backup',
      acao: 'Executar Serviço',
      valorOrcamento: 'R$ 150,00',
      cliente: {
        nome: 'João',
        email: 'joao@email.com',
        cpf: '123.456.789-00',
        telefone: '(41) 99911-2233',
        endereco: 'Rua Chile, 200 - Curitiba, PR'
      }
    },
    {
      id: 14,
      status: 'EM MANUTENÇÃO',
      data: '18/03/2026, 09:00',
      categoria: 'Impressora',
      produto: 'Brother Mono',
      problema: 'Barulho estranho ao imprimir',
      acao: 'Trocar Engrenagens',
      valorOrcamento: 'R$ 180,00',
      cliente: {
        nome: 'José',
        email: 'jose@email.com',
        cpf: '987.654.321-00',
        telefone: '(41) 98822-3344',
        endereco: 'Rua Marechal, 30 - Curitiba, PR'
      }
    },
    {
      id: 15,
      status: 'ARRUMADA',
      data: '18/03/2026, 16:30',
      categoria: 'Mouse',
      produto: 'Razer Deathadder',
      problema: 'Scroll solto',
      acao: 'Aguardar Retirada',
      valorOrcamento: 'R$ 90,00',
      manutencaoRealizada: 'Substituição do eixo do scroll',
      cliente: {
        nome: 'Joana',
        email: 'joana@email.com',
        cpf: '111.222.333-44',
        telefone: '(11) 96655-4433',
        endereco: 'Rua Augusta, 500 - São Paulo, SP'
      }
    },
    {
      id: 16,
      status: 'REDIRECIONADA',
      data: '17/03/2026, 11:00',
      categoria: 'Teclado',
      produto: 'Teclado Bluetooth',
      problema: 'Não sincroniza',
      acao: 'Enviar Unidade 2',
      funcionarioDestino: 'Técnico Mário',
      cliente: {
        nome: 'Joaquina',
        email: 'joaquina@email.com',
        cpf: '444.555.666-77',
        telefone: '(41) 95544-3322',
        endereco: 'Rua Alagoas, 15 - Curitiba, PR'
      }
    },
    {
      id: 17,
      status: 'PAGA',
      data: '17/03/2026, 14:00',
      categoria: 'Notebook',
      produto: 'HP Pavilion',
      problema: 'Upgrade SSD',
      acao: 'Entregar Equipamento',
      valorOrcamento: 'R$ 320,00',
      manutencaoRealizada: 'Instalação de SSD 480GB',
      dataManutencao: '17/03/2026, 16:00',
      cliente: {
        nome: 'João',
        email: 'joao@email.com',
        cpf: '123.456.789-00',
        telefone: '(41) 99887-7766',
        endereco: 'Av. Paraná, 1200 - Curitiba, PR'
      }
    },
    {
      id: 18,
      status: 'FINALIZADA',
      data: '15/03/2026, 10:00',
      categoria: 'Desktop',
      produto: 'PC Positivo',
      problema: 'Vírus e lentidão',
      acao: 'Arquivar Solicitação',
      valorOrcamento: 'R$ 100,00',
      manutencaoRealizada: 'Limpeza de software e otimização',
      dataManutencao: '16/03/2026, 09:00',
      cliente: {
        nome: 'José',
        email: 'jose@email.com',
        cpf: '987.654.321-00',
        telefone: '(41) 94433-2211',
        endereco: 'Rua Itupava, 800 - Curitiba, PR'
      }
    },
    {
      id: 19,
      status: 'ABERTA',
      data: '23/03/2026, 12:00',
      categoria: 'Impressora',
      produto: 'Canon Pixma',
      problema: 'Ejetando folha branca',
      acao: 'Avaliar Cabeçote',
      cliente: {
        nome: 'Joana',
        email: 'joana@email.com',
        cpf: '111.222.333-44',
        telefone: '(11) 93322-1100',
        endereco: 'Rua Oscar Freire, 20 - São Paulo, SP'
      }
    },
    {
      id: 20,
      status: 'ORÇADA',
      data: '14/03/2026, 09:00',
      categoria: 'Notebook',
      produto: 'Asus Vivobook',
      problema: 'Dobradiça quebrada',
      acao: 'Aguardando Aprovação',
      valorOrcamento: 'R$ 280,00',
      dataOrcamento: '14/03/2026, 11:00',
      cliente: {
        nome: 'Joaquina',
        email: 'joaquina@email.com',
        cpf: '444.555.666-77',
        telefone: '(41) 96677-8899',
        endereco: 'Rua Brigadeiro, 150 - Curitiba, PR'
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
      case 'ARRUMADA':
        return 'os-card-arrumada';
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
      case 'ARRUMADA':
        return 'os-badge-arrumada';
      case 'FINALIZADA':
        return 'os-badge-finalizada';
      default:
        return '';
    }
  }

  getClasseIndicador(status: StatusSolicitacao): string {
    switch (status) {
      case 'ARRUMADA':
        return 'os-indicador-arrumada';
      case 'FINALIZADA':
        return 'os-indicador-finalizada';
      default:
        return 'os-indicador-neutro';
    }
  }
}