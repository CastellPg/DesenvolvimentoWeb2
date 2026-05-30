import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

declare var bootstrap: any;

interface FuncionarioApi {
  id: number;
  nome: string;
  email: string;
  data_nascimento: string;
}

interface Funcionario {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string;
  voce: boolean;
}

interface ApiError {
  message?: string;
  messages?: string[];
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  messages?: string[];
}

@Component({
  selector: 'app-crud-funcionario',
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './crud-funcionario.html',
  styleUrl: './crud-funcionario.css',
})
export class CrudFuncionarioComponent implements OnInit {

  private readonly apiUrl = 'http://localhost:8080/funcionarios';
  private readonly cacheKey = 'funcionarios';

  idParaExcluir: number | null = null;
  idParaEditar: number | null = null;
  carregando = false;
  funcionarios: Funcionario[] = [];

  formFuncionario!: FormGroup;
  formEditarFuncionario!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.formFuncionario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      dataNascimento: ['', Validators.required]
    });

    this.formEditarFuncionario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', Validators.required]
    });

    this.carregarFuncionariosDoCache();
    this.listarFuncionarios();
  }

  prepararExclusao(id: number) {
    this.idParaExcluir = id;
  }

  confirmarExclusao() {
    if (this.idParaExcluir === null) {
      return;
    }

    const idExcluido = this.idParaExcluir;
    this.idParaExcluir = null;

    this.http.delete(`${this.apiUrl}/${idExcluido}`, { headers: this.criarHeadersRemocao() }).subscribe({
      next: () => {
        this.funcionarios = this.funcionarios.filter(funcionario => funcionario.id !== idExcluido);
        this.salvarFuncionariosNoCache();
        this.mostrarAviso('Funcionario removido com sucesso!');
      },
      error: (erro) => {
        this.mostrarAviso(this.extrairMensagemErro(erro, 'Erro ao remover funcionario.'));
      }
    });
  }

  listarFuncionarios() {
    this.carregando = true;

    this.http.get<ApiResponse<FuncionarioApi[]> | FuncionarioApi[]>(this.apiUrl)
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (resposta) => {
          const funcionariosApi = this.extrairLista(resposta);
          this.funcionarios = this.ordenarFuncionarios(
            funcionariosApi.map(funcionario => this.converterFuncionario(funcionario))
          );
          this.salvarFuncionariosNoCache();
        },
        error: (erro) => this.mostrarAviso(this.extrairMensagemErro(erro, 'Erro ao carregar funcionarios.'))
      });
  }

  criarFuncionario() {
    if (this.formFuncionario.invalid) {
      this.formFuncionario.markAllAsTouched();
      return;
    }

    const request = {
      nome: this.formFuncionario.value.nome,
      email: this.formFuncionario.value.email,
      senha: this.formFuncionario.value.senha,
      data_nascimento: this.formFuncionario.value.dataNascimento
    };

    this.http.post<ApiResponse<FuncionarioApi> | FuncionarioApi>(this.apiUrl, request).subscribe({
      next: (resposta) => {
        const funcionarioCriado = this.extrairDados(resposta);
        this.formFuncionario.reset();
        this.funcionarios = this.ordenarFuncionarios([
          ...this.funcionarios,
          this.converterFuncionario(funcionarioCriado)
        ]);
        this.salvarFuncionariosNoCache();
        this.fecharModal('modalNovoFuncionario');
        this.mostrarAviso('Funcionario criado com sucesso!');
      },
      error: (erro) => this.mostrarAviso(this.extrairMensagemErro(erro, 'Erro ao criar funcionario.'))
    });
  }

  prepararEdicao(funcionario: Funcionario) {
    this.idParaEditar = funcionario.id;

    this.formEditarFuncionario.patchValue({
      nome: funcionario.nome,
      email: funcionario.email,
      dataNascimento: funcionario.dataNascimento
    });
  }

  atualizarFuncionario() {
    if (this.formEditarFuncionario.invalid || this.idParaEditar === null) {
      this.formEditarFuncionario.markAllAsTouched();
      return;
    }

    const idAtualizado = this.idParaEditar;
    const funcionariosAntesDaAtualizacao = [...this.funcionarios];
    const request = {
      nome: this.formEditarFuncionario.value.nome,
      email: this.formEditarFuncionario.value.email,
      data_nascimento: this.formEditarFuncionario.value.dataNascimento
    };

    this.funcionarios = this.ordenarFuncionarios(
      this.funcionarios.map(funcionario =>
        funcionario.id === idAtualizado
          ? {
              ...funcionario,
              nome: request.nome,
              email: request.email,
              dataNascimento: request.data_nascimento
            }
          : funcionario
      )
    );
    this.salvarFuncionariosNoCache();
    this.idParaEditar = null;

    this.http.put(`${this.apiUrl}/${idAtualizado}`, request, { responseType: 'text' }).subscribe({
      next: () => this.mostrarAviso('Funcionario atualizado com sucesso!'),
      error: () => {
        this.funcionarios = funcionariosAntesDaAtualizacao;
        this.salvarFuncionariosNoCache();
        this.mostrarAviso('Erro ao atualizar funcionario.');
      }
    });
  }

  private converterFuncionario(funcionario: FuncionarioApi): Funcionario {
    const usuarioLogadoId = Number(localStorage.getItem('usuarioId'));

    return {
      id: funcionario.id,
      nome: funcionario.nome,
      email: funcionario.email,
      dataNascimento: funcionario.data_nascimento,
      voce: funcionario.id === usuarioLogadoId
    };
  }

  private criarHeadersRemocao() {
    const usuarioLogadoId = localStorage.getItem('usuarioId') || '';
    return new HttpHeaders({ idUsuarioLogado: usuarioLogadoId });
  }

  private carregarFuncionariosDoCache() {
    const funcionariosEmCache = localStorage.getItem(this.cacheKey);

    if (funcionariosEmCache) {
      try {
        this.funcionarios = this.ordenarFuncionarios(JSON.parse(funcionariosEmCache));
      } catch {
        localStorage.removeItem(this.cacheKey);
      }
    }
  }

  private salvarFuncionariosNoCache() {
    localStorage.setItem(this.cacheKey, JSON.stringify(this.funcionarios));
  }

  private ordenarFuncionarios(funcionarios: Funcionario[]) {
    return [...funcionarios].sort((funcionario1, funcionario2) => funcionario1.id - funcionario2.id);
  }

  private extrairDados<T>(resposta: ApiResponse<T> | T): T {
    if (resposta && typeof resposta === 'object' && 'data' in resposta) {
      return (resposta as ApiResponse<T>).data;
    }

    return resposta as T;
  }

  private extrairLista(resposta: ApiResponse<FuncionarioApi[]> | FuncionarioApi[]): FuncionarioApi[] {
    const dados = this.extrairDados(resposta);
    return Array.isArray(dados) ? dados : [];
  }

  private extrairMensagemErro(erro: { error?: ApiError | string }, mensagemPadrao: string) {
    if (typeof erro.error === 'string') {
      return erro.error || mensagemPadrao;
    }

    return erro.error?.messages?.join(' | ') || erro.error?.message || mensagemPadrao;
  }

  private fecharModal(idModal: string) {
    const elementoModal = document.getElementById(idModal);
    const instanciaModal = elementoModal && typeof bootstrap !== 'undefined' && bootstrap?.Modal
      ? bootstrap.Modal.getInstance(elementoModal)
      : null;
    instanciaModal?.hide();
  }

  mostrarAviso(mensagem: string) {
    const spanTexto = document.getElementById('textoAviso');
    if (spanTexto) {
      spanTexto.innerText = mensagem;
    }

    const elementoAviso = document.getElementById('avisoSucesso');
    if (elementoAviso && typeof bootstrap !== 'undefined' && bootstrap?.Toast) {
      const exibirAviso = new bootstrap.Toast(elementoAviso);
      exibirAviso.show();
    }
  }
}
