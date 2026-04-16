import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

declare var bootstrap: any;

interface Categoria {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-categoria-equipamento',
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './categoria-equipamento.html',
  styleUrl: './categoria-equipamento.css',
})
export class CategoriaEquipamentoComponent implements OnInit {

  private readonly apiUrl = 'http://localhost:8080/categorias';
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

    this.formEditarCategoria = this.fb.group({
      nome: ['', Validators.required]
    });

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

    this.http.get<Categoria[]>(this.apiUrl)
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
      next: (resposta) => {
        this.categorias = this.ordenarCategorias(resposta);
        this.salvarCategoriasNoCache();
      },
      error: () => {
        this.mostrarAviso('Erro ao carregar categorias.');
      }
    });
  }

  criarCategoria() {
    if (this.formCategoria.valid) {
      const categoria = {
        nome: this.formCategoria.value.nome
      };

      this.http.post<Categoria>(this.apiUrl, categoria).subscribe({
        next: (categoriaCriada) => {
          this.formCategoria.reset();
          this.categorias = this.ordenarCategorias([...this.categorias, categoriaCriada]);
          this.salvarCategoriasNoCache();
          this.mostrarAviso('Categoria criada com sucesso!');
        },
        error: () => this.mostrarAviso('Erro ao criar categoria.')
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

      this.http.put<Categoria>(`${this.apiUrl}/${idAtualizado}`, categoria).subscribe({
        next: (categoriaAtualizada) => {
          this.categorias = this.ordenarCategorias(
            this.categorias.map(categoriaAtual =>
              categoriaAtual.id === categoriaAtualizada.id ? categoriaAtualizada : categoriaAtual
            )
          );
          this.salvarCategoriasNoCache();
          this.mostrarAviso('Categoria atualizada com sucesso!');
        },
        error: () => {
          this.categorias = categoriasAntesDaAtualizacao;
          this.salvarCategoriasNoCache();
          this.mostrarAviso('Erro ao atualizar categoria.');
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

  mostrarAviso(mensagem: string) {
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
}
