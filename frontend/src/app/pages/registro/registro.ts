import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroComponent {
  constructor(private http: HttpClient) {}

  public endereco = {
    cep: '',
    logradouro: '',
    cidade: '',
    estado: '',
  };

  buscarCep() {
    let cepLimpo = this.endereco.cep;

    cepLimpo = cepLimpo.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      this.http
        .get(`https://viacep.com.br/ws/${cepLimpo}/json/`)

        .subscribe((dados: any) => {
          console.log(dados);

          this.endereco.logradouro = dados.logradouro;
          this.endereco.cidade = dados.localidade;
          this.endereco.estado = dados.uf;
        });
    } else {
      console.log('CEP inválido, digite novamente!');
    }
  }
}
