import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nova-solicitacao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './nova-solicitacao.html',
  styleUrls: ['./nova-solicitacao.css']
})
export class NovaSolicitacaoComponent implements OnInit {
  solicitacaoForm!: FormGroup;

  categorias: string[] = [
    'Informática',
    'Impressoras',
    'Monitores',
    'Celulares',
    'Tablets',
    'Notebooks'
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // formulário com validações
    this.solicitacaoForm = this.fb.group({
      descricaoEquipamento: ['', [Validators.required, Validators.maxLength(100)]],
      categoria: ['', Validators.required],
      descricaoDefeito: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.solicitacaoForm.valid) {
      // Cria o objeto simulando o envio pro Back-end
      const novaSolicitacao = {
        ...this.solicitacaoForm.value,
        dataHora: new Date().toISOString(),
        estado: 'ABERTA'
      };

      console.log('Enviando para o Spring Boot:', novaSolicitacao);

      // pop-up e redirecionamento, provisorio
      alert('Solicitação registrada com sucesso!');
      this.router.navigate(['/client/dashboard']);
    } else {
      // erro ao usuario tentar enviar em branco
      this.solicitacaoForm.markAllAsTouched();
    }
  }
}
