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
perfilUsuario: string | null = "FUNCIONARIO";
  nomeUsuario: string | null = "Corno Da Silva";

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

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.perfilUsuario = null;
    this.nomeUsuario = null;
    this.router.navigate(['/login']);
  }
}