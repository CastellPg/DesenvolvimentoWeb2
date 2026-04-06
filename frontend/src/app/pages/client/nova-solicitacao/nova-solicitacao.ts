import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

declare var bootstrap: any;

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
    mensagemToast: string = '';

    mostrarToast(mensagem: string) {
      this.mensagemToast = mensagem;
      const toastElement = document.getElementById('avisoSucesso')!;
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();
      }
    }

  constructor(private fb: FormBuilder, private router: Router) {}

  salvarNovaSolicitacao() {
    console.log ('Salvando dados...');
    this.mostrarToast('Solicitação enviada com sucesso!');
  }

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
      // cria o objeto simulando o envio pro Back
      const novaSolicitacao = {
        ...this.solicitacaoForm.value,
        dataHora: new Date().toISOString(),
        estado: 'ABERTA'
      };

      console.log('Enviando para o Spring Boot:', novaSolicitacao);
      this.mostrarToast('Solicitação enviada com sucesso!');
      setTimeout(() => {
      this.router.navigate(['/client/dashboard']);
    }, 2000);
    } else {
      // erro ao usuario tentar enviar em branco
      this.solicitacaoForm.markAllAsTouched();
    }
  }
}
