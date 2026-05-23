import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { timeout } from 'rxjs';
import { SolicitacaoService, SolicitacaoResponse, ItemOrcamentoRequest } from '../../../services/solicitacao.service';

declare var bootstrap: any;

@Component({
  selector: 'app-efetuar-orcamento',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxMaskDirective],
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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.formItem = this.fb.group({
      tipo: ['PECA', Validators.required],
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valorUnitario: ['', Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.erro = 'Solicitação não informada na rota.';
      this.cdr.detectChanges();
      return;
    }

    this.carregarSolicitacao(id);
  }

  carregarSolicitacao(id: string): void {
    this.carregarSolicitacaoDoCache(id);
    this.carregando = !this.solicitacao;
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
    const valorUnitario = this.converterValorMonetario(val.valorUnitario);

    if (valorUnitario <= 0) {
      this.formItem.get('valorUnitario')?.setErrors({ min: true });
      return;
    }

    this.itens.push({
      tipo: val.tipo,
      descricao: val.descricao,
      quantidade: Number(val.quantidade),
      valorUnitario,
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
      this.erro = 'Sessão inválida. Faça login novamente.';
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
          this.mostrarAviso('Orçamento registrado com sucesso!');
          this.cdr.detectChanges();
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

  getTipoLabel(tipo: string): string {
    return this.tiposItem.find((item) => item.value === tipo)?.label || tipo;
  }

  private converterValorMonetario(valor: unknown): number {
    if (typeof valor === 'number') {
      return valor;
    }

    const texto = String(valor ?? '')
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    const numero = Number(texto);
    return Number.isFinite(numero) ? numero : 0;
  }

  private extrairMensagemErro(err: any, mensagemPadrao: string): string {
    if (err?.name === 'TimeoutError') {
      return 'O backend demorou demais para responder. Verifique se ele está rodando e conectado ao banco.';
    }

    if (err?.status === 0) {
      return 'Não foi possível conectar ao backend em http://localhost:8080.';
    }

    return err?.error?.messages?.join(' | ') || err?.error?.message || err?.error || mensagemPadrao;
  }
}
