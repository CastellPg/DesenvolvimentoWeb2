import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface CategoriaResponse {
  id: number;
  nome: string;
}

export interface SolicitacaoResponse {
  id: number;
  descricaoEquipamento: string;
  categoria: string;
  descricaoDefeito: string;
  status: string;
  dataCriacao: string;
  valorOrcado: number | null;
  motivoRejeicao: string | null;
}

export interface AbrirSolicitacaoRequest {
  clienteId: number;
  descricaoEquipamento: string;
  categoriaId: number;
  descricaoDefeito: string;
}

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/solicitacoes';
  private categoriasUrl = 'http://localhost:8080/categorias';

  //Busca a lista do cliente
  listarPorCliente(clienteId: number): Observable<SolicitacaoResponse[]> {
    return this.http.get<SolicitacaoResponse[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  //Busca os detalhes de apenas uma solicitação
  buscarPorId(id: string | number): Observable<SolicitacaoResponse> {
    return this.http.get<SolicitacaoResponse>(`${this.apiUrl}/${id}`);
  }

  // RF004
  abrirSolicitacao(request: AbrirSolicitacaoRequest): Observable<SolicitacaoResponse> {
    return this.http.post<SolicitacaoResponse>(this.apiUrl, request);
  }

  //Busca categorias ativas
  getCategorias(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(`${this.categoriasUrl}`);
  }
}
