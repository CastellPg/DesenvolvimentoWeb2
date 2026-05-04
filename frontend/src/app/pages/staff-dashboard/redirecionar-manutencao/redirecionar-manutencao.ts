import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, timeout } from 'rxjs';
import { SolicitacaoResponse, SolicitacaoService } from '../../../services/solicitacao.service';

declare var bootstrap: any;

interface ApiResponse<T> {
  data: T;
}

interface FuncionarioApi {
  id: number;
  nome: string;
  email: string;
}

@Component({
  selector: 'app-redirecionar-manutencao',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './redirecionar-manutencao.html',
  styleUrl: './redirecionar-manutencao.css',
})
export class RedirecionarManutencaoComponent implements OnInit {
  solicitacao: SolicitacaoResponse | null = null;
  formRedirecionamento!: FormGroup;

  tecnicoOrigem = localStorage.getItem('nomeUsuario') ?? 'Tecnico';
  dataHoraAtual = new Date().toLocaleString('pt-BR');
  funcionarios: FuncionarioApi[] = [];
  carregando = false;
  enviando = false;
  mensagemErro: string | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private solicitacaoService = inject(SolicitacaoService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.formRedirecionamento = this.fb.group({
      funcionarioDestinoId: ['', Validators.required],
      motivo: ['', Validators.required]
    });

    if (!id) {
      this.mensagemErro = 'Solicitacao nao informada na rota.';
      return;
    }

    this.carregarSolicitacao(id);
    this.carregarFuncionarios();
  }

  confirmarRedirecionamento(): void {
    if (this.formRedirecionamento.invalid || !this.solicitacao) {
      this.formRedirecionamento.markAllAsTouched();
      return;
    }

    const funcionarioOrigemId = Number(localStorage.getItem('usuarioId'));
    if (!funcionarioOrigemId) {
      this.mensagemErro = 'Sessao invalida. Faca login novamente.';
      return;
    }

    const request = {
      funcionarioDestinoId: Number(this.formRedirecionamento.value.funcionarioDestinoId),
      motivo: this.formRedirecionamento.value.motivo.trim()
    };

    this.enviando = true;
    this.mensagemErro = null;

    this.solicitacaoService.redirecionarManutencao(this.solicitacao.id, request, funcionarioOrigemId).pipe(
      timeout(10000),
      finalize(() => {
        this.enviando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (solicitacaoAtualizada) => {
        this.atualizarSolicitacaoNoCache(solicitacaoAtualizada);
        this.mostrarAviso('Solicitacao redirecionada com sucesso!');
        setTimeout(() => this.router.navigate(['/solicitacoes']), 1800);
      },
      error: (err) => {
        this.mensagemErro = this.extrairMensagemErro(err, 'Erro ao redirecionar manutencao.');
      }
    });
  }

  mostrarAviso(mensagem: string): void {
    const spanTexto = document.getElementById('textoAviso');
    if (spanTexto) {
      spanTexto.innerText = mensagem;
    }

    const elementoAviso = document.getElementById('avisoSucesso');
    if (elementoAviso) {
      const exibirAviso = new bootstrap.Toast(elementoAviso);
      exibirAviso.show();
    }
  }

  private carregarSolicitacao(id: string): void {
    this.carregando = true;
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (!this.solicitacao) {
          this.mensagemErro = this.extrairMensagemErro(err, 'Erro ao carregar os dados da solicitacao.');
        }
      }
    });
  }

  private carregarFuncionarios(): void {
    const usuarioLogadoId = Number(localStorage.getItem('usuarioId'));

    this.http.get<ApiResponse<FuncionarioApi[]> | FuncionarioApi[]>('http://localhost:8080/funcionarios').pipe(
      timeout(10000)
    ).subscribe({
      next: (response) => {
        const lista = Array.isArray(response) ? response : response.data;
        this.funcionarios = (lista || []).filter(funcionario => funcionario.id !== usuarioLogadoId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mensagemErro = this.extrairMensagemErro(err, 'Erro ao carregar funcionarios.');
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

      const atualizadas = solicitacoes.filter((item: any) => Number(item.id) !== Number(solicitacaoAtualizada.id));
      localStorage.setItem(cacheKey, JSON.stringify(atualizadas));
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  private extrairMensagemErro(err: any, mensagemPadrao: string): string {
    if (err?.name === 'TimeoutError') return 'Backend demorou demais para responder.';
    if (err?.status === 0) return 'Nao foi possivel conectar ao backend em http://localhost:8080.';
    return err?.error?.messages?.join(' | ') || err?.error?.message || mensagemPadrao;
  }
}
