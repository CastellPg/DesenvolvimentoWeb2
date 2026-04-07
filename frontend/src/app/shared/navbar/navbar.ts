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
  perfilUsuario: string | null = null;
  nomeUsuario: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    //pega as info q estao salvas no localStorege do login e exibe no navbar
    this.nomeUsuario = localStorage.getItem('nomeUsuario');
    this.perfilUsuario = localStorage.getItem('perfil');
  }

  logout() {
    // aqui remove as informações do usuário q estao salvas no localStorage
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('perfil');
    this.perfilUsuario = null;
    this.nomeUsuario = null;
    this.router.navigate(['/login']);
  }
}
