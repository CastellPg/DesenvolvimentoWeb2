import { Component, WritableSignal, Signal, signal, inject } from '@angular/core';
import { RouterLink} from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class LoginComponent {
  hidePassword: WritableSignal<boolean> = signal(true);

  togglePassword() {
    this.hidePassword.update(value => !value);
  }

//teste usando ngModele
  loginUsuario = {
    email: '',
    senha: ''
  };

  private http = inject(HttpClient);

  fazerLogin() {
    console.log('Pegando os dados do form', this.loginUsuario);

    if (!this.loginUsuario.email || !this.loginUsuario.senha) {
      alert('Email e senha são obrigatórios!');
      return;
    }

    if (this.loginUsuario.senha.length < 4){
      alert('Senha precisa ter 4 digitos')
      return;
    }

    //falta fazer a parte do backend, mas aqui faz a requisição (alterar a URL para o endpoint do backend quando feito)
    this.http.post('http://localhost:8080/login', this.loginUsuario).subscribe({
      next: (response) => {
        console.log('Resposta do servidor:', response);
      },
      error: (error) => {
        console.error('Erro ao fazer login:', error);
      }
    });
  }


}
