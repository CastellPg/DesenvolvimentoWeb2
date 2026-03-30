import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-staff-dashboard',
  imports: [CommonModule],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboardComponent {

 solicitacoes = [
  { id: 1, status: 'ABERTA', data: '23/03/2026, 09:30', cliente: 'João Silva', produto: 'Dell Inspiron 15 3000' },
  { id: 2, status: 'EM ANÁLISE', data: '23/03/2026, 10:45', cliente: 'Carlos Alberto', produto: 'PlayStation 5 - Barulho no Cooler' },
  { id: 3, status: 'AGUARDANDO PEÇA', data: '22/03/2026, 11:00', cliente: 'Lucas Lima', produto: 'Placa Mãe Asus B450' },
  { id: 4, status: 'APROVADA', data: '22/03/2026, 14:00', cliente: 'Beatriz Costa', produto: 'MacBook Air - Troca de Bateria' },
  { id: 5, status: 'PRONTO PARA RETIRADA', data: '21/03/2026, 16:00', cliente: 'Ricardo Gomes', produto: 'Monitor LG 29" - Tela piscando' },
  { id: 6, status: 'FINALIZADA', data: '20/03/2026, 16:45', cliente: 'Ana Paula', produto: 'iPhone 13 - Troca de Tela' },
  { id: 7, status: 'REPROVADA', data: '19/03/2026, 09:00', cliente: 'Marcos Souza', produto: 'Notebook HP - Derramou café' }
];

efetuarOrcamento(solicitacao: any) {
  console.log('Orçando para:', solicitacao.cliente);
  //Tem q arrumar o Modal aqui dae
}
}
