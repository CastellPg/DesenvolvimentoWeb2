import { Component,ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

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

  public endereco = {
    cep: '',
    logradouro: '',
    cidade: '',
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
          this.endereco.cidade = dados.localidade;
          this.endereco.estado = dados.uf;

          setTimeout(() => {
            this.campoNumero.nativeElement.focus();

          }, 50);
        });
    } 
  }
}
