import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize, timeout } from 'rxjs';

declare var bootstrap: any;

interface Categoria {
  id: number;
  nome: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  messages?: string[];
}

@Component({
  selector: 'app-categoria-equipamento',
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './categoria-equipamento.html',
  styleUrl: './categoria-equipamento.css',
})
export class CategoriaEquipamentoComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:8080/categorias';
  // Cache so para a tela nao abrir vazia enquanto o backend responde.
  private readonly cacheKey = 'categoriasEquipamento';

  idParaExcluir: number | null = null;
  idParaEditar: number | null = null;
  carregando = false;
  categorias: Categoria[] = [];

  formCategoria!: FormGroup;
  formEditarCategoria!: FormGroup;

  constructor(private http: HttpClient,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.formCategoria = this.fb.group({
      nome: ['', Validators.required]
    });

    // Formulario separado para editar, assim nao mistura com o cadastro novo
    this.formEditarCategoria = this.fb.group({
      nome: ['', Validators.required]
    });

    // Mostra o cache primeiro e depois atualiza de verdade buscando no backend
    this.carregarCategoriasDoCache();
    this.listarCategorias();
  }

  prepararExclusao(id: number) {
    this.idParaExcluir = id;
  }

  confirmarExclusao() {
    if (this.idParaExcluir !== null) {
      const idExcluido = this.idParaExcluir;
      const categoriasAntesDaExclusao = [...this.categorias];

      // Tira da tela antes da resposta para parecer mais rapido
      // Se der erro, coloca a lista antiga de volta
      this.categorias = this.categorias.filter(categoria => categoria.id !== idExcluido);
      this.salvarCategoriasNoCache();
      this.idParaExcluir = null;

      this.http.delete(`${this.apiUrl}/${idExcluido}`).subscribe({
        next: () => {
          this.mostrarAviso('Categoria removida com sucesso!');
        },
        error: () => {
          this.categorias = categoriasAntesDaExclusao;
          this.salvarCategoriasNoCache();
          this.mostrarAviso('Erro ao remover categoria.');
        }
      });
    }
  }

  listarCategorias() {
    this.carregando = true;
    this.http.get<ApiResponse<Categoria[]> | Categoria[]>(this.apiUrl)
      .pipe(
        timeout(10000),
        finalize(() => this.carregando = false)
      )
      .subscribe({
      next: (resposta) => {
        this.categorias = this.ordenarCategorias(this.extrairLista(resposta));
        this.salvarCategoriasNoCache();
      },
      error: (erro) => {
        this.mostrarAviso(this.extrairMensagemErro(erro, 'Erro ao carregar categorias.'));
      }
    });
  }

  criarCategoria() {
    if (this.formCategoria.valid) {
      const categoria = {
        nome: this.formCategoria.value.nome
      };

      this.http.post<ApiResponse<Categoria> | Categoria>(this.apiUrl, categoria).pipe(
        timeout(10000)
      ).subscribe({
        next: (response) => {
          const categoriaCriada = this.extrairDados(response);
          this.formCategoria.reset();
          this.categorias = this.ordenarCategorias([...this.categorias, categoriaCriada]);
          this.salvarCategoriasNoCache();
          this.mostrarAviso('Categoria criada com sucesso!');
        },
        error: (erro) => this.mostrarAviso(this.extrairMensagemErro(erro, 'Erro ao criar categoria.'))
      });
    }
  }

  prepararEdicao(cat: Categoria) {
    this.idParaEditar = cat.id;

    this.formEditarCategoria.patchValue({
      nome: cat.nome
    });
  }

  atualizarCategoria() {
    if (this.formEditarCategoria.valid) {
      if (this.idParaEditar === null) {
        return;
      }

      const idAtualizado = this.idParaEditar;
      const categoriasAntesDaAtualizacao = [...this.categorias];
      // Mesmo formato do request de atualizar categoria no backend.
      const categoria = {
        nome: this.formEditarCategoria.value.nome
      };
      this.categorias = this.ordenarCategorias(
        this.categorias.map(categoriaAtual =>
          categoriaAtual.id === idAtualizado
            ? { ...categoriaAtual, nome: categoria.nome }
            : categoriaAtual
        )
      );
      this.salvarCategoriasNoCache();
      this.idParaEditar = null;

      this.http.put<ApiResponse<Categoria> | Categoria>(`${this.apiUrl}/${idAtualizado}`, categoria).pipe(
        timeout(10000)
      ).subscribe({
        next: (response) => {
          const categoriaAtualizada = this.extrairDados(response);
          this.categorias = this.ordenarCategorias(
            this.categorias.map(categoriaAtual =>
              categoriaAtual.id === categoriaAtualizada.id ? categoriaAtualizada : categoriaAtual
            )
          );
          this.salvarCategoriasNoCache();
          this.mostrarAviso('Categoria atualizada com sucesso!');
        },
        error: (erro) => {
          this.categorias = categoriasAntesDaAtualizacao;
          this.salvarCategoriasNoCache();
          this.mostrarAviso(this.extrairMensagemErro(erro, 'Erro ao atualizar categoria.'));
        }
      });
    }
  }

  private carregarCategoriasDoCache() {
    const categoriasEmCache = localStorage.getItem(this.cacheKey);

    if (categoriasEmCache) {
      try {
        this.categorias = this.ordenarCategorias(JSON.parse(categoriasEmCache));
      } catch {
        localStorage.removeItem(this.cacheKey);
      }
    }
  }

  private salvarCategoriasNoCache() {
    localStorage.setItem(this.cacheKey, JSON.stringify(this.categorias));
  }

  private ordenarCategorias(categorias: Categoria[]) {
    return [...categorias].sort((categoria1, categoria2) => categoria1.id - categoria2.id);
  }

  private extrairDados<T>(response: ApiResponse<T> | T): T {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as ApiResponse<T>).data;
    }

    return response as T;
  }

  private extrairLista(response: ApiResponse<Categoria[]> | Categoria[]): Categoria[] {
    const dados = this.extrairDados(response);
    return Array.isArray(dados) ? dados : [];
  }

  private extrairMensagemErro(erro: any, mensagemPadrao: string): string {
    if (erro?.name === 'TimeoutError') {
      return 'Backend demorou demais para responder.';
    }

    if (erro?.status === 0) {
      return 'Não foi possível conectar ao backend em http://localhost:8080.';
    }

    return erro?.error?.messages?.join(' | ') || erro?.error?.message || mensagemPadrao;
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
