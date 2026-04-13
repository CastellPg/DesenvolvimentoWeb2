import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoriaResponse {
  id: number;
  nome: string;
  ativa: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/solicitacoes';
  private categoriasUrl = 'http://localhost:8080/api/categorias';

  //Busca a lista do cliente
  listarPorCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  //Busca os detalhes de apenas uma solicitação
  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  //Busca categorias ativas
  getCategorias(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(`${this.categoriasUrl}`);
  }
}
