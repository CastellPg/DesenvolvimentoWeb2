import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-receitas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receitas.html',
  styleUrl: './receitas.css'
})
export class ReceitasComponent {
  dataInicio: string = '';
  dataFim: string = '';

  receitas: any[] = [];
}