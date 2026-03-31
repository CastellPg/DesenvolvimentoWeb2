import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-crud-funcionario',
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './crud-funcionario.html',
  styleUrl: './crud-funcionario.css',
})
export class CrudFuncionarioComponent implements OnInit {

  idParaExcluir: number | null = null;
  idParaEditar: number | null = null;

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
      dataNascimento: ['', Validators.required]
    });

    this.formEditarFuncionario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', Validators.required]
    });
  }

  funcionarios = [
    { id: 1, nome: 'Carlos Técnico', email: 'carlos@empresa.com', dataNascimento: '1990-05-14', voce: true },
    { id: 2, nome: 'Ana Suporte', email: 'ana@empresa.com', dataNascimento: '1992-08-19', voce: false },
    { id: 3, nome: 'Ricardo Manutenção', email: 'ricardo@empresa.com', dataNascimento: '1988-03-09', voce: false }
  ];

  prepararExclusao(id: number) {
    this.idParaExcluir = id;
  }

  confirmarExclusao() {
    if (this.idParaExcluir !== null) {
      this.funcionarios = this.funcionarios.filter(f => f.id !== this.idParaExcluir);

      console.log('Funcionário excluído localmente', this.idParaExcluir);
      this.idParaExcluir = null;

      this.mostrarAviso('Funcionário removido com sucesso!');
    }
  }

  listarFuncionarios() {
    // depois você integra com o backend
  }

  criarFuncionario() {
    if (this.formFuncionario.valid) {
      const novoId = this.funcionarios.length > 0
        ? Math.max(...this.funcionarios.map(f => f.id)) + 1
        : 1;

      this.funcionarios.push({
        id: novoId,
        nome: this.formFuncionario.value.nome,
        email: this.formFuncionario.value.email,
        dataNascimento: this.formFuncionario.value.dataNascimento,
        voce: false
      });

      this.formFuncionario.reset();

      this.mostrarAviso('Funcionário criado com sucesso!');
    }
  }

  prepararEdicao(funcionario: any) {
    this.idParaEditar = funcionario.id;

    this.formEditarFuncionario.patchValue({
      nome: funcionario.nome,
      email: funcionario.email,
      dataNascimento: funcionario.dataNascimento
    });
  }

  atualizarFuncionario() {
    if (this.formEditarFuncionario.valid) {
      const indice = this.funcionarios.findIndex(f => f.id === this.idParaEditar);

      if (indice !== -1) {
        this.funcionarios[indice].nome = this.formEditarFuncionario.value.nome;
        this.funcionarios[indice].email = this.formEditarFuncionario.value.email;
        this.funcionarios[indice].dataNascimento = this.formEditarFuncionario.value.dataNascimento;
      }

      console.log(`Editando funcionário ID ${this.idParaEditar}`);
      this.idParaEditar = null;

      this.mostrarAviso('Funcionário atualizado com sucesso!');
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