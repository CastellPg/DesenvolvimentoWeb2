import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { RegistrarManutencaoRequest, SolicitacaoResponse, SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './efetuar-manutencao.html',
  styleUrl: './efetuar-manutencao.css',
})
export class EfetuarManutencaoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private solicitacaoService = inject(SolicitacaoService);

  solicitacao: SolicitacaoResponse | null = null;
  formManutencao!: FormGroup;

  nomeUsuario = localStorage.getItem('nomeUsuario') ?? 'Tecnico';
  funcionarioId = Number(localStorage.getItem('usuarioId'));

  carregando = false;
  enviando = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.formManutencao = this.fb.group({
      descricaoManutencao: ['', Validators.required],
      orientacoesCliente: ['', Validators.required],
      pecasUsadas: [''],
      tempoGasto: [null, [Validators.min(1), Validators.pattern('^[0-9]*$')]]
    });

    if (!id) {
      this.mensagemErro = 'Solicitacao nao informada na rota.';
      return;
    }

    this.carregarSolicitacao(id);
  }

  carregarSolicitacao(id: string): void {
    this.carregando = true;
    this.mensagemErro = null;
    this.carregarSolicitacaoDoCache(id);
    this.cdr.detectChanges();

    this.solicitacaoService.buscarPorId(id).pipe(
      timeout(10000),
      finalize(() => {
        this.carregando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.solicitacao = data;
        this.atualizarSolicitacaoNoCache(data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (!this.solicitacao) {
          this.mensagemErro = this.extrairMensagemErro(err, 'Erro ao carregar os dados da solicitacao.');
        }
      }
    });
  }

  confirmarManutencao(): void {
    if (this.formManutencao.invalid || !this.solicitacao) {
      this.formManutencao.markAllAsTouched();
      return;
    }

    const { descricaoManutencao, orientacoesCliente, pecasUsadas, tempoGasto } = this.formManutencao.value;

    const request: RegistrarManutencaoRequest = {
      descricaoManutencao,
      orientacoesCliente,
      pecasUsadas: pecasUsadas || undefined,
      tempoGasto: tempoGasto ? Number(tempoGasto) : undefined
    };

    this.enviando = true;
    this.mensagemErro = null;
    this.mensagemSucesso = null;
    this.cdr.detectChanges();

    this.solicitacaoService.registrarManutencao(this.solicitacao.id, request, this.funcionarioId).pipe(
      timeout(10000),
      finalize(() => {
        this.enviando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (solicitacaoAtualizada) => {
        this.solicitacao = solicitacaoAtualizada;
        this.atualizarSolicitacaoNoCache(solicitacaoAtualizada);
        this.mensagemSucesso = 'Manutencao registrada com sucesso!';
        setTimeout(() => this.router.navigate(['/solicitacoes']), 1800);
      },
      error: (err) => {
        this.mensagemErro = this.extrairMensagemErro(err, 'Erro ao registrar manutencao. Tente novamente.');
      }
    });
  }

  private carregarSolicitacaoDoCache(id: string): void {
    const funcionarioId = localStorage.getItem('usuarioId');
    if (!funcionarioId) return;

    const cache = localStorage.getItem(`solicitacoes-funcionario-${funcionarioId}`);
    if (!cache) return;

    try {
      const solicitacoes = JSON.parse(cache);
      const encontrada = Array.isArray(solicitacoes)
        ? solicitacoes.find((item: any) => String(item.id) === String(id))
        : null;

      if (!encontrada) return;

      this.solicitacao = {
        id: Number(encontrada.id),
        descricaoEquipamento: encontrada.produto || encontrada.descricaoEquipamento || '-',
        categoria: encontrada.categoria || '-',
        descricaoDefeito: encontrada.problema || encontrada.descricaoDefeito || '-',
        status: encontrada.status || 'APROVADA',
        dataCriacao: encontrada.dataOriginal || encontrada.dataCriacao || new Date().toISOString(),
        valorOrcado: encontrada.valorOrcado ?? null,
        motivoRejeicao: encontrada.motivoRejeicao ?? null,
        cliente: encontrada.cliente ?? null
      };
    } catch {
      localStorage.removeItem(`solicitacoes-funcionario-${funcionarioId}`);
    }
  }

  private atualizarSolicitacaoNoCache(solicitacaoAtualizada: SolicitacaoResponse): void {
    const funcionarioId = localStorage.getItem('usuarioId');
    if (!funcionarioId) return;

    const cacheKey = `solicitacoes-funcionario-${funcionarioId}`;
    const cache = localStorage.getItem(cacheKey);
    if (!cache) return;

    try {
      const solicitacoes = JSON.parse(cache);
      if (!Array.isArray(solicitacoes)) return;

      const atualizadas = solicitacoes.map((item: any) =>
        Number(item.id) === Number(solicitacaoAtualizada.id)
          ? {
              ...item,
              status: solicitacaoAtualizada.status,
              valorOrcado: solicitacaoAtualizada.valorOrcado,
              motivoRejeicao: solicitacaoAtualizada.motivoRejeicao,
            }
          : item
      );

      localStorage.setItem(cacheKey, JSON.stringify(atualizadas));
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  private extrairMensagemErro(err: any, mensagemPadrao: string): string {
    if (err?.name === 'TimeoutError') {
      return 'Backend demorou demais para responder.';
    }

    if (err?.status === 0) {
      return 'Nao foi possivel conectar ao backend em http://localhost:8080.';
    }

    return err?.error?.messages?.join(' | ') || err?.error?.message || mensagemPadrao;
  }
}
