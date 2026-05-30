import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface ApiResponse<T> {
  data: T;
}

export interface SessaoUsuario {
  id: number;
  nome: string;
  perfil: 'CLIENTE' | 'FUNCIONARIO';
}

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly http = inject(HttpClient);
  private readonly sessaoUrl = 'http://localhost:8080/login/sessao';

  verificarSessao(): Observable<SessaoUsuario | null> {
    return this.http.get<ApiResponse<SessaoUsuario> | SessaoUsuario>(this.sessaoUrl).pipe(
      map((response) => {
        const usuario = this.extrairDados(response);

        if (!usuario?.id || !usuario?.perfil) {
          return null;
        }

        return usuario;
      }),
      catchError(() => of(null))
    );
  }

  limparSessaoLocal(): void {
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('perfil');
    localStorage.removeItem('usuarioId');
  }

  sincronizarSessaoLocal(usuario: SessaoUsuario): void {
    localStorage.setItem('usuarioId', String(usuario.id));
    localStorage.setItem('perfil', usuario.perfil);
    localStorage.setItem('nomeUsuario', usuario.nome ?? '');
  }

  rotaPadraoPorPerfil(perfil: SessaoUsuario['perfil']): string {
    return perfil === 'CLIENTE' ? '/client' : '/staff';
  }

  private extrairDados<T>(response: ApiResponse<T> | T): T {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as ApiResponse<T>).data;
    }

    return response as T;
  }
}
