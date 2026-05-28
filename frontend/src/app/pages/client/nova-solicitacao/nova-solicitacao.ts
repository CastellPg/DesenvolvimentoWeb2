import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CategoriaResponse, SolicitacaoService } from '../../../services/solicitacao.service';
import { finalize, timeout } from 'rxjs';

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
  tipoToast: 'success' | 'danger' = 'success';
  enviando = false;
  carregandoCategorias = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private solicitacaoService = inject(SolicitacaoService);
  private cdr = inject(ChangeDetectorRef);

  mostrarToast(mensagem: string, tipo: 'success' | 'danger' = 'success') {
    this.mensagemToast = mensagem;
    this.tipoToast = tipo;
    this.cdr.detectChanges();

    const toastElement = document.getElementById('avisoSucesso')!;
    if (toastElement && typeof bootstrap !== 'undefined' && bootstrap?.Toast) {
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
    this.carregandoCategorias = true;
    this.solicitacaoService.getCategorias().pipe(
      timeout(10000),
      finalize(() => {
        this.carregandoCategorias = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (cats) => {
        this.categorias = cats
          .filter(categoria => categoria.id && categoria.nome)
          .sort((categoria1, categoria2) => categoria1.nome.localeCompare(categoria2.nome));
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mostrarToast(this.extrairMensagemErro(err, 'Erro ao carregar categorias.'), 'danger');
      }
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
      this.mostrarToast('Erro de sessão. Faça login novamente.', 'danger');
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
        this.mostrarToast(err.error?.messages?.[0] ?? 'Erro ao criar solicitação. Tente novamente.', 'danger');
      }
    });
  }

  private extrairMensagemErro(err: any, mensagemPadrao: string): string {
    if (err?.name === 'TimeoutError') {
      return 'Backend demorou demais para responder.';
    }

    if (err?.status === 0) {
      return 'Não foi possível conectar ao backend em http://localhost:8080.';
    }

    return err?.error?.messages?.join(' | ') || err?.error?.message || mensagemPadrao;
  }
}
