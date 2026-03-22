import { Component,ViewChild, ElementRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, FormsModule, NgxMaskDirective],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroComponent {
  @ViewChild ('inputNumero') campoNumero!: ElementRef;
  constructor(private http: HttpClient) {}

  private router = inject(Router);

  public endereco = {
    cep: '',
    logradouro: '',
    cidade: '',
    bairro: '',
    estado: '',
    numero: '',
    complemento: '',
  };

  public dados = {
    cpf: '',
    nomeCompleto: '',
    email: '',
    telefone: ''
  };

  buscarCep() {
    if(!this.endereco.cep) return;

    let cepLimpo = this.endereco.cep;

    cepLimpo = cepLimpo.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      this.http
        .get(`https://viacep.com.br/ws/${cepLimpo}/json/`)

        .subscribe((dados: any) => {
          console.log(dados);

          if(dados.erro){
            console.log('CEP não encontrado!');
            return;
          }

          this.endereco.logradouro = dados.logradouro;
          this.endereco.bairro = dados.bairro;
          this.endereco.cidade = dados.localidade;
          this.endereco.estado = dados.uf;

          setTimeout(() => {
            this.campoNumero.nativeElement.focus();

          }, 50);
        });
    } 
  }

  registrar(){
    const dados_registrar = {
      cpf: this.dados.cpf,
      email: this.dados.email,
      nome: this.dados.nomeCompleto,
      telefone: this.dados.telefone,
      cep: this.endereco.cep,
      logradouro: this.endereco.logradouro,
      numero: this.endereco.numero,
      complemento: this.endereco.complemento,
      bairro: this.endereco.bairro, 
      cidade: this.endereco.cidade,
      estado: this.endereco.estado
    }


    this.http.post('http://localhost:8080/clientes/cadastro', dados_registrar , { responseType: 'text' })
      .subscribe({
        next: (res) => {
          alert('Cadastro realizado com sucesso! Verifique seu e-mail.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro no cadastro:', err);
          alert('Erro ao cadastrar: ' + (err.error?.message || 'Verifique os campos'));
        }
      });
  }
}
