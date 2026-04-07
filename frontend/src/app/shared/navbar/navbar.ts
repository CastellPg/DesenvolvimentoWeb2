import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
perfilUsuario: string | null = "CLIENTE";
  nomeUsuario: string | null = "Silvio Soares";

  constructor(private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('usuarioLogado');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.perfilUsuario = user.perfil;
        this.nomeUsuario = user.nome;
      } catch (e) {
        console.error("Erro ao ler dados do usuário", e);
        this.logout();
      }
    }
  }
  alternarPerfil() {
    if (this.perfilUsuario === 'FUNCIONARIO') {
      this.perfilUsuario = 'CLIENTE';
      this.nomeUsuario = 'Marquinhos Lima';
      this.router.navigate(['/client/dashboard']);
    } else {
      this.perfilUsuario = 'FUNCIONARIO';
      this.nomeUsuario = 'Silvio Soares';
      this.router.navigate(['/staff']);
    }

    const novoUsuario = { nome: this.nomeUsuario, perfil: this.perfilUsuario };
    localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
  }
  logout() {
    localStorage.removeItem('usuarioLogado');
    this.perfilUsuario = null;
    this.nomeUsuario = null;
    this.router.navigate(['/login']);
  }
}
