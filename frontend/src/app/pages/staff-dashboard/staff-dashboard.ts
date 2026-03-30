import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-staff-dashboard',
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboardComponent {

 solicitacoes = [
  { id: 1, status: 'ABERTA', data: '23/03/2026, 09:30', cliente: 'João Silva', produto: 'Dell Inspiron 15 3000' },
  { id: 2, status: 'ABERTA', data: '23/03/2026, 10:45', cliente: 'Carlos Alberto', produto: 'PlayStation 5 - Barulho no Cooler' },
  { id: 3, status: 'ABERTA', data: '22/03/2026, 11:00', cliente: 'Lucas Lima', produto: 'Placa Mãe Asus B450' },
];

efetuarOrcamento(solicitacao: any) {
  console.log('Orçando para:', solicitacao.cliente);
  //Tem q arrumar o Modal aqui dae
}
}
