import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';
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
    { value: 'PECA', label: 'Peca' },
    { value: 'MAO_OBRA', label: 'Mao de Obra' },
    { value: 'SERVICO', label: 'Servico' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private solicitacaoService: SolicitacaoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.formItem = this.fb.group({
      tipo: ['PECA', Validators.required],
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valorUnitario: ['', [Validators.required, Validators.min(0.01)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.erro = 'Solicitacao nao informada na rota.';
      this.cdr.detectChanges();
      return;
    }

    this.carregarSolicitacao(id);
  }

  carregarSolicitacao(id: string): void {
    this.carregarSolicitacaoDoCache(id);
    this.carregando = !this.solicitacao;
    this.erro = null;
    this.cdr.detectChanges();

    this.solicitacaoService.buscarPorId(id)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.solicitacao = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.erro = this.extrairMensagemErro(err, 'Nao foi possivel carregar a solicitacao.');
          this.cdr.detectChanges();
        },
      });
  }

  private carregarSolicitacaoDoCache(id: string): void {
    const funcionarioId = localStorage.getItem('usuarioId');
    if (!funcionarioId) {
      return;
    }

    const cache = localStorage.getItem(`solicitacoes-funcionario-${funcionarioId}`);
    if (!cache) {
      return;
    }

    try {
      const solicitacoes = JSON.parse(cache);
      const solicitacaoCache = solicitacoes.find((item: any) => String(item.id) === String(id));

      if (!solicitacaoCache) {
        return;
      }

      this.solicitacao = {
        id: Number(solicitacaoCache.id),
        descricaoEquipamento: solicitacaoCache.produto || solicitacaoCache.descricaoEquipamento || '-',
        categoria: solicitacaoCache.categoria || '-',
        descricaoDefeito: solicitacaoCache.problema || solicitacaoCache.descricaoDefeito || '-',
        status: solicitacaoCache.status || 'ABERTA',
        dataCriacao: solicitacaoCache.dataOriginal || solicitacaoCache.dataCriacao || new Date().toISOString(),
        valorOrcado: solicitacaoCache.valorOrcado ?? null,
        motivoRejeicao: solicitacaoCache.motivoRejeicao ?? null,
        cliente: solicitacaoCache.cliente || null,
      };
    } catch {
      localStorage.removeItem(`solicitacoes-funcionario-${funcionarioId}`);
    }
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
    this.cdr.detectChanges();
  }

  removerItem(index: number): void {
    this.itens.splice(index, 1);
    this.cdr.detectChanges();
  }

  confirmarOrcamento(): void {
    if (this.itens.length === 0 || !this.solicitacao) return;

    const funcionarioIdRaw = localStorage.getItem('usuarioId');
    const funcionarioId = funcionarioIdRaw ? Number(funcionarioIdRaw) : null;

    if (!funcionarioId) {
      this.erro = 'Sessao invalida. Faca login novamente.';
      this.cdr.detectChanges();
      return;
    }

    this.enviando = true;
    this.erro = null;
    this.cdr.detectChanges();

    this.solicitacaoService
      .efetuarOrcamento(this.solicitacao.id, { itens: this.itens }, funcionarioId)
      .subscribe({
        next: () => {
          this.enviando = false;
          this.mostrarAviso('Orcamento registrado com sucesso!');
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/staff']), 2000);
        },
        error: (err) => {
          this.enviando = false;
          this.erro = this.extrairMensagemErro(err, 'Erro ao registrar orcamento.');
          this.cdr.detectChanges();
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

  private extrairMensagemErro(err: any, mensagemPadrao: string): string {
    if (err?.name === 'TimeoutError') {
      return 'O backend demorou demais para responder. Verifique se ele esta rodando e conectado ao banco.';
    }

    if (err?.status === 0) {
      return 'Nao foi possivel conectar ao backend em http://localhost:8080.';
    }

    return err?.error?.messages?.join(' | ') || err?.error?.message || err?.error || mensagemPadrao;
  }
}
