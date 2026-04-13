import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Espelha o CategoriaResponse do backend
export interface CategoriaResponse {
  id: number;
  nome: string;
}

// Espelha o SolicitacaoResponse do backend
export interface SolicitacaoResponse {
  id: number;
  descricaoEquipamento: string;
  categoria: string;
  descricaoDefeito: string;
  status: string;
  dataCriacao: string;       // ISO-8601 — consumido pelo pipe 'date' do Angular
  valorOrcado: number | null;
  motivoRejeicao: string | null;
}

// Espelha o AbrirSolicitacaoRequest do backend
export interface AbrirSolicitacaoRequest {
  clienteId: number;
  descricaoEquipamento: string;
  categoriaId: number;   // ID numérico da FK para tabela categorias
  descricaoDefeito: string;
}

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {

  private readonly baseUrl = 'http://localhost:8080/solicitacoes';
  private readonly categoriasUrl = 'http://localhost:8080/categorias';
  private readonly http = inject(HttpClient);

  // Carrega categorias ativas para dropdown de nova solicitação
  getCategorias(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(this.categoriasUrl);
  }

  // RF004
  abrirSolicitacao(request: AbrirSolicitacaoRequest): Observable<SolicitacaoResponse> {
    return this.http.post<SolicitacaoResponse>(this.baseUrl, request);
  }

  // RF005
  buscarPorId(id: string | number): Observable<SolicitacaoResponse> {
    return this.http.get<SolicitacaoResponse>(`${this.baseUrl}/${id}`);
  }
}
