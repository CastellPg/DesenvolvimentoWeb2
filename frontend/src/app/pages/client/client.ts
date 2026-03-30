iimport { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterModule], // usa para poder utilizar router-outlet e routerLink
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  nomeCliente: string = 'João'; // para ser integrado ao back

  constructor() {}

  ngOnInit(): void {
  }
}
