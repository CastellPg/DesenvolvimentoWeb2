import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  perfilUsuario: string | null = null;
  nomeUsuario: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    this.perfilUsuario = user.perfil || null;
    this.nomeUsuario = user.nome || null;
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.perfilUsuario = null;
    this.router.navigate(['/login']);
  }
}