import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

interface Categoria {
  id: number;
  nome: string;
}

interface CategoriaPage {
  content: Categoria[];
  number: number;
  totalPages: number;
  totalElements: number;
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

  idParaExcluir: number | null = null;
  idParaEditar: number | null = null;
  paginaAtual = 0;
  tamanhoPagina = 10;
  totalPaginas = 0;
  totalElementos = 0;
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

    this.listarCategorias();
  }

  prepararExclusao(id: number) {
    this.idParaExcluir = id;
  }

  confirmarExclusao() {
    if (this.idParaExcluir !== null) {
      this.http.delete(`${this.apiUrl}/${this.idParaExcluir}`).subscribe({
        next: () => {
          this.idParaExcluir = null;
          this.listarCategorias();
          this.mostrarAviso('Categoria removida com sucesso!');
        },
        error: () => this.mostrarAviso('Erro ao remover categoria.')
      });
    }
  }

  listarCategorias(pagina: number = this.paginaAtual) {
    this.carregando = true;

    this.http.get<CategoriaPage>(`${this.apiUrl}?page=${pagina}&size=${this.tamanhoPagina}&sort=nome`).subscribe({
      next: (resposta) => {
        this.categorias = resposta.content;
        this.paginaAtual = resposta.number;
        this.totalPaginas = resposta.totalPages;
        this.totalElementos = resposta.totalElements;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.mostrarAviso('Erro ao carregar categorias.');
      }
    });
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.listarCategorias(this.paginaAtual - 1);
    }
  }

  proximaPagina() {
    if (this.paginaAtual + 1 < this.totalPaginas) {
      this.listarCategorias(this.paginaAtual + 1);
    }
  }

  criarCategoria() {
    if (this.formCategoria.valid) {
      const categoria = {
        nome: this.formCategoria.value.nome
      };

      this.http.post<Categoria>(this.apiUrl, categoria).subscribe({
        next: () => {
          this.formCategoria.reset();
          this.listarCategorias(0);
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

      const categoria = {
        nome: this.formEditarCategoria.value.nome
      };

      this.http.put<Categoria>(`${this.apiUrl}/${this.idParaEditar}`, categoria).subscribe({
        next: () => {
          this.idParaEditar = null;
          this.listarCategorias();
          this.mostrarAviso('Categoria atualizada com sucesso!');
        },
        error: () => this.mostrarAviso('Erro ao atualizar categoria.')
      });
    }
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
