import { Component, WritableSignal, Signal, signal, inject } from '@angular/core';
import { RouterLink, Router} from "@angular/router";
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

  mensagemErro: string = '';

  togglePassword() {
    this.hidePassword.update(value => !value);
  }

//teste usando ngModele
  loginUsuario = {
    email: '',
    senha: ''
  };

  private http = inject(HttpClient);
  private router = inject(Router);
  fazerLogin() {
    this.mensagemErro = '';
    console.log('Pegando os dados do form', this.loginUsuario);

    if (!this.loginUsuario.email || !this.loginUsuario.senha) {
      alert('Email e senha são obrigatórios!');
      return;
    }

    if (this.loginUsuario.senha.length < 4){
      alert('Senha precisa ter 4 digitos')
      return;
    }

    this.http.post<any>('http://localhost:8080/login', this.loginUsuario).subscribe({
      next: (response) => {
        localStorage.setItem('perfil', response.perfil);
        localStorage.setItem('nomeUsuario', response.nome);

        if (response.perfil === 'CLIENTE') {
          this.router.navigate(['/client']);
        } else if (response.perfil === 'FUNCIONARIO') {
          this.router.navigate(['/staff-dashboard']);
        }
        
      },
      error: (error) => {
        console.error('Erro ao fazer login:', error);
      }
    });
  }


}
