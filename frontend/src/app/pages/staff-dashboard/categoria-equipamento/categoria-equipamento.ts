import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-categoria-equipamento',
  imports: [HttpClientModule,
            ReactiveFormsModule,
            CommonModule,     
  ],
  templateUrl: './categoria-equipamento.html',
  styleUrl: './categoria-equipamento.css',
})
export class CategoriaEquipamentoComponent implements OnInit {

  
  idParaExcluir: number | null = null;
  idParaEditar: number | null = null;

  formCategoria!: FormGroup;
  formEditarCategoria!: FormGroup;
  
  constructor(private http: HttpClient,
              private fb: FormBuilder,
  ){}

   ngOnInit() {
      //Inicia form de criação de categoria
      this.formCategoria = this.fb.group({
      nome: ['', Validators.required]
    });
     //Inicia form de criar categoria
     this.formEditarCategoria = this.fb.group({
      nome: ['', Validators.required]
    });
    }

    // Funções do botão delete
  prepararExclusao(id: number){
    this.idParaExcluir = id
  }

  /*confirmarExclusao(){
    this.http.delete(`http://localhost:8080/categorias/${this.idParaExcluir}`).subscribe({

      next: () => {
        console.log('Excluído com sucesso');
        this.listarCategorias();
        this.idParaExcluir = null;
      },
      error: (err) => console.log('Erro ao excluir', err)
    });
  }*/

    confirmarExclusao(){
      if(this.idParaExcluir) {
        this.categorias = this.categorias.filter(c => c.id !== this.idParaExcluir)

        console.log('Excluído localmente', this.idParaExcluir);
        this.idParaExcluir = null;

        this.mostrarAviso('Categoria removida com sucesso!');
      }
    }

   
    listarCategorias(){
     // Vou fazer quando integrarmos com o back  
    }

    // Modal nova Categoria
  
    categorias = [
      { id: 1, nome: 'Notebook' },
      { id: 2, nome: 'Impressora' },
      { id: 3, nome: 'Monitor' },
      { id: 4, nome: 'teclado' },
      { id: 5, nome: 'Desktop' }
    ];

    criarCategoria() {
      if(this.formCategoria.valid){
        const nomeDigitado = this.formCategoria.value.nome;

        const novoId = this.categorias.length > 0 ? Math.max(...this.categorias.map(c => c.id)) + 1 : 1;

        this.categorias.push({id: novoId, nome:nomeDigitado});

        this.formCategoria.reset();

        this.mostrarAviso('Categoria criada com sucesso!');
      }
    }

    // modal atualizar/editar categoria

    prepararEdicao(cat: any){
      this.idParaEditar = cat.id;

      this.formEditarCategoria.patchValue({
        nome:cat.nome
      });
    }

    atualizarCategoria(){
      if(this.formEditarCategoria.valid){
        const novoNome = this.formEditarCategoria.value.nome;

        const indice = this.categorias.findIndex(c => c.id === this.idParaEditar);
        if(indice !== -1){
          this.categorias[indice].nome = novoNome;
          
        }
        console.log(`Editando ID ${this.idParaEditar} para: ${novoNome}`);
        //Aqui vai ir um put quando colocar o back

        this.idParaEditar = null;

         this.mostrarAviso('Categoria atualizada com sucesso!');

      }
    }

    mostrarAviso(mensagem: string){

      const spanTexto = document.getElementById('textoAviso');
      if (spanTexto){
        spanTexto.innerText = mensagem;
      }
        const elementoAviso = document.getElementById('avisoSucesso');
        if(elementoAviso) {
          const exibirAviso = new bootstrap.Toast(elementoAviso);
          exibirAviso.show();
        }
    }


}