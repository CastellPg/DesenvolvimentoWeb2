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
      categoria: 'Impressora',
      produto: 'HP LaserJet Pro M404dn',
      problema: 'Impressora com erro de papel atolado',
      acao: 'Efetuar Orçamento',
      cliente: {
        nome: 'Maria Santos',
        email: 'maria@email.com',
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
      produto: 'Lenovo ThinkCentre M720',
      problema: 'Desktop reiniciando sozinho',
      acao: 'Aguardando Resposta',
      valorOrcamento: 'R$ 450,00',
      dataOrcamento: '22/03/2026, 16:00',
      cliente: {
        nome: 'Pedro Oliveira',
        email: 'pedro@email.com',
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
        nome: 'João Silva',
        email: 'joao@email.com',
        cpf: '123.456.789-00',
        telefone: '(11) 98765-4321',
        endereco: 'Rua A, 123 - São Paulo, SP'
      }
    },
    {
      id: 5,
      status: 'EM MANUTENÇÃO',
      data: '21/03/2026, 08:30',
      categoria: 'Console',
      produto: 'PlayStation 5',
      problema: 'Superaquecimento e desligamento automático',
      acao: 'Realizar Reparo',
      valorOrcamento: 'R$ 250,00',
      cliente: {
        nome: 'Lucas Mendes',
        email: 'lucas@email.com',
        cpf: '222.333.444-55',
        telefone: '(41) 98888-2222',
        endereco: 'Rua XV de Novembro, 500 - Curitiba, PR'
      }
    },
    {
      id: 6,
      status: 'ARRUMADA',
      data: '20/03/2026, 10:00',
      categoria: 'Monitor',
      produto: 'LG UltraWide 29',
      problema: 'Listras verticais na tela',
      acao: 'Aguardar Pagamento',
      valorOrcamento: 'R$ 350,00',
      manutencaoRealizada: 'Troca do cabo flat da tela',
      dataManutencao: '21/03/2026, 15:30',
      cliente: {
        nome: 'Beatriz Ramos',
        email: 'beatriz@email.com',
        cpf: '444.555.666-77',
        telefone: '(41) 97777-3333',
        endereco: 'Rua Sete de Setembro, 12 - Curitiba, PR'
      }
    },
    {
      id: 7,
      status: 'PAGA',
      data: '20/03/2026, 09:00',
      categoria: 'Microfone',
      produto: 'Blue Yeti USB Microphone',
      problema: 'Microfone não capta áudio',
      acao: 'Retirar Equipamento',
      valorOrcamento: 'R$ 80,00',
      dataOrcamento: '20/03/2026, 10:00',
      manutencaoRealizada: 'Limpeza dos contatos USB internos',
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
      id: 8,
      status: 'REDIRECIONADA',
      data: '22/03/2026, 16:00',
      categoria: 'Impressora',
      produto: 'Epson EcoTank L3150',
      problema: 'Impressora não imprime preto',
      acao: 'Transferir Unidade',
      funcionarioDestino: 'Unidade Centro - Técnico Ricardo',
      cliente: {
        nome: 'João Silva',
        email: 'joao@email.com',
        cpf: '123.456.789-00',
        telefone: '(11) 98765-4321',
        endereco: 'Rua A, 123 - São Paulo, SP'
      }
    },
    {
      id: 9,
      status: 'FINALIZADA',
      data: '18/03/2026, 14:00',
      categoria: 'Placa de Vídeo',
      produto: 'RTX 3060 Ti',
      problema: 'Artefatos na tela',
      acao: 'Arquivar Solicitação',
      valorOrcamento: 'R$ 600,00',
      manutencaoRealizada: 'Reballing das memórias VRAM',
      dataManutencao: '19/03/2026, 11:00',
      cliente: {
        nome: 'Carlos Eduardo',
        email: 'carlos@email.com',
        cpf: '555.666.777-88',
        telefone: '(41) 95555-4444',
        endereco: 'Rua Itupava, 800 - Curitiba, PR'
      }
    },
    {
      id: 10,
      status: 'ABERTA',
      data: '23/03/2026, 08:00',
      categoria: 'Notebook',
      produto: 'Acer Aspire 5',
      problema: 'Teclado com teclas travadas',
      acao: 'Efetuar Orçamento',
      cliente: {
        nome: 'Pedro Oliveira',
        email: 'pedro@email.com',
        cpf: '111.222.333-44',
        telefone: '(41) 99999-1111',
        endereco: 'Av. Brasil, 50 - Curitiba, PR'
      }
    },
    {
      id: 11,
      status: 'EM MANUTENÇÃO',
      data: '23/03/2026, 11:30',
      categoria: 'Placa de Vídeo',
      produto: 'RTX 3070',
      problema: 'Fans não giram sob carga',
      acao: 'Trocar Fans',
      valorOrcamento: 'R$ 200,00',
      cliente: {
        nome: 'Gabriel Costa',
        email: 'gabriel@email.com',
        cpf: '222.888.444-11',
        telefone: '(41) 98877-6655',
        endereco: 'Rua Batel, 450 - Curitiba, PR'
      }
    },
    {
      id: 12,
      status: 'ORÇADA',
      data: '19/03/2026, 10:00',
      categoria: 'Notebook',
      produto: 'Macbook Air M1',
      problema: 'Teclado falhando tecla Shift',
      acao: 'Aguardar Aprovação',
      valorOrcamento: 'R$ 1.200,00',
      cliente: {
        nome: 'Luana Melo',
        email: 'luana@email.com',
        cpf: '333.111.222-99',
        telefone: '(11) 97766-5544',
        endereco: 'Alameda Santos, 1000 - São Paulo, SP'
      }
    },
    {
      id: 13,
      status: 'APROVADA',
      data: '19/03/2026, 14:00',
      categoria: 'Desktop',
      produto: 'PC Gamer Custom',
      problema: 'Formatação e Backup de 1TB',
      acao: 'Limpar e Formatar',
      valorOrcamento: 'R$ 150,00',
      cliente: {
        nome: 'Bruno Rocha',
        email: 'bruno@email.com',
        cpf: '555.444.333-22',
        telefone: '(41) 99911-2233',
        endereco: 'Rua Chile, 200 - Curitiba, PR'
      }
    },
    {
      id: 14,
      status: 'EM MANUTENÇÃO',
      data: '18/03/2026, 09:00',
      categoria: 'Monitor',
      produto: 'Dell 24 Pol',
      problema: 'Fonte interna queimada',
      acao: 'Trocar Capacitores',
      valorOrcamento: 'R$ 180,00',
      cliente: {
        nome: 'Claudia Lima',
        email: 'claudia@email.com',
        cpf: '777.888.999-00',
        telefone: '(41) 98822-3344',
        endereco: 'Rua Marechal, 30 - Curitiba, PR'
      }
    },
    {
      id: 15,
      status: 'ARRUMADA',
      data: '18/03/2026, 16:30',
      categoria: 'Console',
      produto: 'Nintendo Switch',
      problema: 'Joycon Drift analógico esquerdo',
      acao: 'Aguardar Retirada',
      valorOrcamento: 'R$ 90,00',
      manutencaoRealizada: 'Troca do módulo analógico',
      cliente: {
        nome: 'Sérgio Nogueira',
        email: 'sergio@email.com',
        cpf: '121.232.343-45',
        telefone: '(11) 96655-4433',
        endereco: 'Rua Augusta, 500 - São Paulo, SP'
      }
    },
    {
      id: 16,
      status: 'REDIRECIONADA',
      data: '17/03/2026, 11:00',
      categoria: 'Smartphone',
      produto: 'S22 Ultra',
      problema: 'Tela quebrada após queda',
      acao: 'Enviar p/ Especialista',
      funcionarioDestino: 'Laboratório Avançado de Telas',
      cliente: {
        nome: 'Patrícia Dias',
        email: 'patricia@email.com',
        cpf: '999.000.111-22',
        telefone: '(41) 95544-3322',
        endereco: 'Rua Alagoas, 15 - Curitiba, PR'
      }
    },
    {
      id: 17,
      status: 'PAGA',
      data: '17/03/2026, 14:00',
      categoria: 'Notebook',
      produto: 'Acer Nitro 5',
      problema: 'Upgrade de RAM 16GB',
      acao: 'Entregar Equipamento',
      valorOrcamento: 'R$ 320,00',
      manutencaoRealizada: 'Instalação de pente DDR4 Kingston',
      dataManutencao: '17/03/2026, 16:00',
      cliente: {
        nome: 'Rodrigo Alves',
        email: 'rodrigo@email.com',
        cpf: '221.332.443-54',
        telefone: '(41) 99887-7766',
        endereco: 'Av. Paraná, 1200 - Curitiba, PR'
      }
    },
    {
      id: 18,
      status: 'FINALIZADA',
      data: '15/03/2026, 10:00',
      categoria: 'Fonte',
      produto: 'Corsair 750W',
      problema: 'Estalo seguido de cheiro de queimado',
      acao: 'Arquivar Solicitação',
      valorOrcamento: 'R$ 200,00',
      manutencaoRealizada: 'Troca de fusível e varistor',
      dataManutencao: '16/03/2026, 09:00',
      cliente: {
        nome: 'Igor Ferreira',
        email: 'igor@email.com',
        cpf: '888.777.666-55',
        telefone: '(41) 94433-2211',
        endereco: 'Rua Itupava, 800 - Curitiba, PR'
      }
    },
    {
      id: 19,
      status: 'ABERTA',
      data: '23/03/2026, 12:00',
      categoria: 'Smartwatch',
      produto: 'Galaxy Watch 4',
      problema: 'Touch travado na tela inicial',
      acao: 'Avaliar Software',
      cliente: {
        nome: 'Daniela Souza',
        email: 'dani@email.com',
        cpf: '000.111.222-33',
        telefone: '(11) 93322-1100',
        endereco: 'Rua Oscar Freire, 20 - São Paulo, SP'
      }
    },
    {
      id: 20,
      status: 'ORÇADA',
      data: '14/03/2026, 09:00',
      categoria: 'Notebook',
      produto: 'HP Pavilion',
      problema: 'Dobradiça direita quebrada',
      acao: 'Aguardando Aprovação',
      valorOrcamento: 'R$ 280,00',
      dataOrcamento: '14/03/2026, 11:00',
      cliente: {
        nome: 'Renato Porto',
        email: 'renato@email.com',
        cpf: '444.333.222-11',
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