import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  perfilUsuario: string | null = null;
  nomeUsuario: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    //pega as info q estao salvas no localStorege do login e exibe no navbar
    this.nomeUsuario = localStorage.getItem('nomeUsuario');
    this.perfilUsuario = localStorage.getItem('perfil');
  }

  logout() {
    this.http.post('http://localhost:8080/login/logout', {}).subscribe({
      next: () => this.finalizarLogoutLocal(),
      error: () => this.finalizarLogoutLocal(),
    });
  }

  private finalizarLogoutLocal(): void {
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('perfil');
    localStorage.removeItem('usuarioId');
    this.perfilUsuario = null;
    this.nomeUsuario = null;
    this.router.navigate(['/login']);
  }
}
