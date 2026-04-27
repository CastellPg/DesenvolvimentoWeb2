import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoriaResponse, SolicitacaoService } from '../../../services/solicitacao.service';

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
  // Categorias carregadas da API — exibem nome, enviam ID como FK
  categorias: CategoriaResponse[] = [];
  mensagemToast = '';
  enviando = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private solicitacaoService = inject(SolicitacaoService);

  mostrarToast(mensagem: string) {
    this.mensagemToast = mensagem;
    const toastElement = document.getElementById('avisoSucesso')!;
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
      toast.show();
    }
  }

  ngOnInit(): void {
    this.solicitacaoForm = this.fb.group({
      // maxLength(50) — espelha VARCHAR(50) da coluna descricao_equipamento
      descricaoEquipamento: ['', [Validators.required, Validators.maxLength(50)]],
      categoriaId: [null, Validators.required],
      descricaoDefeito: ['', [Validators.required, Validators.maxLength(1000)]]
    });

    // Carrega categorias ativas do backend para o dropdown
    this.solicitacaoService.getCategorias().subscribe({
      next: (cats) => this.categorias = cats,
      error: () => this.mostrarToast('Erro ao carregar categorias.')
    });
  }

  onSubmit(): void {
    if (this.solicitacaoForm.invalid) {
      this.solicitacaoForm.markAllAsTouched();
      return;
    }

    // Lê o ID do cliente salvo no localStorage após o login
    const clienteId = Number(localStorage.getItem('usuarioId'));
    if (!clienteId) {
      this.mostrarToast('Erro de sessão. Faça login novamente.');
      return;
    }

    this.enviando = true;
    this.solicitacaoService.abrirSolicitacao({
      clienteId,
      descricaoEquipamento: this.solicitacaoForm.value.descricaoEquipamento,
      categoriaId: Number(this.solicitacaoForm.value.categoriaId),
      descricaoDefeito: this.solicitacaoForm.value.descricaoDefeito
    }).subscribe({
      next: () => {
        this.enviando = false;
        this.mostrarToast('Solicitação criada com sucesso!');
        setTimeout(() => this.router.navigate(['/client/dashboard']), 2000);
      },
      error: (err) => {
        this.enviando = false;
        // RF004 — exibe mensagem de validação retornada pelo backend, ou mensagem genérica
        this.mostrarToast(err.error?.messages?.[0] ?? 'Erro ao criar solicitação. Tente novamente.');
      }
    });
  }
}
