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

  ngOnInit(): void {
    this.solicitacaoForm = this.fb.group({
      descricaoEquipamento: ['', [Validators.required, Validators.maxLength(100)]],
      categoria: ['', Validators.required],
      descricaoDefeito: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.solicitacaoForm.valid) {
      const dados = localStorage.getItem('banco_dados_v1');
      const banco = dados ? JSON.parse(dados) : [];
      const novoId = banco.length > 0 ? Math.max(...banco.map((s: any) => s.id)) + 1 : 1;

      const novaSolicitacao = {
        id: novoId,
        equipamento: this.solicitacaoForm.value.descricaoEquipamento,
        categoria: this.solicitacaoForm.value.categoria,
        descricaoDefeito: this.solicitacaoForm.value.descricaoDefeito,
        dataHora: new Date().toISOString(),
        estado: 'ABERTA',
        historico: [
          {
            dataHora: new Date().toISOString(),
            estadoNovo: 'ABERTA',
            descricao: 'Solicitação criada pelo cliente',
            funcionario: 'Cliente'
          }
        ]
      };

      banco.push(novaSolicitacao);
      localStorage.setItem('banco_dados_v1', JSON.stringify(banco));
      this.mostrarToast('Solicitação criada com sucesso!');
      
      setTimeout(() => {
        this.router.navigate(['/client/dashboard']);
      }, 2000);
    } else {
      this.solicitacaoForm.markAllAsTouched();
    }
  }
}
