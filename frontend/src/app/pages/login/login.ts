import { Component, WritableSignal, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  hidePassword: WritableSignal<boolean> = signal(true);
  mensagemErro: WritableSignal<string> = signal('');

  loginUsuario = {
    email: '',
    senha: ''
  };

  private http = inject(HttpClient);
  private router = inject(Router);

  togglePassword() {
    this.hidePassword.update(value => !value);
  }

  fazerLogin() {
    this.mensagemErro.set('');
    console.log('Pegando os dados do form', this.loginUsuario);

    if (!this.loginUsuario.email || !this.loginUsuario.senha) {
      this.mensagemErro.set('Email e senha são obrigatórios!');
      return;
    }

    if (this.loginUsuario.email.length > 100) {
      this.mensagemErro.set('Email é muito longo!');
      return;
    }

    if (this.loginUsuario.senha.length < 4) {
      this.mensagemErro.set('Senha precisa ter pelo menos 4 dígitos!');
      return;
    }

    this.http.post<any>('http://localhost:8080/login', this.loginUsuario).subscribe({
      next: (response) => {
        localStorage.setItem('perfil', response.perfil);
        localStorage.setItem('nomeUsuario', response.nome);

        if (response.perfil === 'CLIENTE') {
          this.router.navigate(['/client']);
        } else if (response.perfil === 'FUNCIONARIO') {
          this.router.navigate(['/staff']);
        }
      },
      error: (error) => {
        console.error('Erro ao fazer login:', error);

        if (error.status === 401) {
          this.mensagemErro.set('Email ou senha inválidos.');
        } else if (error.status === 400) {
          this.mensagemErro.set('Dados enviados inválidos.');
        } else if (error.status === 0) {
          this.mensagemErro.set('Não foi possível conectar ao servidor.');
        } else {
          this.mensagemErro.set('Erro ao fazer login. Tente novamente.');
        }
      }
    });
  }
}