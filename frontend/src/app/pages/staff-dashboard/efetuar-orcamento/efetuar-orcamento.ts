import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { timeout } from 'rxjs';
import { SolicitacaoService, SolicitacaoResponse, ItemOrcamentoRequest } from '../../../services/solicitacao.service';

declare var bootstrap: any;

@Component({
  selector: 'app-efetuar-orcamento',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './efetuar-orcamento.html',
  styleUrl: './efetuar-orcamento.css',
})
export class EfetuarOrcamentoComponent implements OnInit {
  solicitacao: SolicitacaoResponse | null = null;
  itens: ItemOrcamentoRequest[] = [];
  formItem!: FormGroup;

  carregando = false;
  enviando = false;
  erro: string | null = null;
  sucessoMensagem: string | null = null;

  tiposItem: { value: 'PECA' | 'MAO_OBRA' | 'SERVICO'; label: string }[] = [
    { value: 'PECA', label: 'Peça' },
    { value: 'MAO_OBRA', label: 'Mão de Obra' },
    { value: 'SERVICO', label: 'Serviço' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private solicitacaoService: SolicitacaoService,
  ) {}

  ngOnInit(): void {
    this.formItem = this.fb.group({
      tipo: ['PECA', Validators.required],
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valorUnitario: ['', [Validators.required, Validators.min(0.01)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarSolicitacao(id);
    }
  }

  carregarSolicitacao(id: string): void {
    this.carregando = true;
    this.erro = null;
    this.solicitacaoService.buscarPorId(id)
      .pipe(timeout(15000))
      .subscribe({
        next: (data) => {
          this.solicitacao = data;
          this.carregando = false;
        },
        error: () => {
          this.erro = 'Não foi possível carregar a solicitação. Verifique se o servidor está ativo.';
          this.carregando = false;
        },
      });
  }

  get totalCalculado(): number {
    return this.itens.reduce((acc, item) => acc + item.quantidade * item.valorUnitario, 0);
  }

  adicionarItem(): void {
    if (this.formItem.invalid) return;
    const val = this.formItem.value;
    this.itens.push({
      tipo: val.tipo,
      descricao: val.descricao,
      quantidade: Number(val.quantidade),
      valorUnitario: Number(val.valorUnitario),
    });
    this.formItem.reset({ tipo: 'PECA', quantidade: 1 });
  }

  removerItem(index: number): void {
    this.itens.splice(index, 1);
  }

  confirmarOrcamento(): void {
    if (this.itens.length === 0 || !this.solicitacao) return;

    const funcionarioIdRaw = localStorage.getItem('usuarioId');
    const funcionarioId = funcionarioIdRaw ? Number(funcionarioIdRaw) : null;

    if (!funcionarioId) {
      this.erro = 'Sessão inválida. Faça login novamente.';
      return;
    }

    this.enviando = true;
    this.erro = null;

    this.solicitacaoService
      .efetuarOrcamento(this.solicitacao.id, { itens: this.itens }, funcionarioId)
      .subscribe({
        next: () => {
          this.enviando = false;
          this.mostrarAviso('Orçamento registrado com sucesso!');
          setTimeout(() => this.router.navigate(['/staff']), 2000);
        },
        error: (err) => {
          this.enviando = false;
          const msgs = err?.error?.data?.messages ?? err?.error?.messages;
          this.erro = msgs?.[0] || err?.error?.data?.message || 'Erro ao registrar orçamento.';
        },
      });
  }

  mostrarAviso(mensagem: string): void {
    this.sucessoMensagem = mensagem;
    const el = document.getElementById('avisoSucesso');
    if (el) {
      const toast = new bootstrap.Toast(el);
      toast.show();
    }
  }
}

