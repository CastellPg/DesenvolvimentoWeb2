import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  cliente?: ClienteResumoResponse | null;
}

export interface ClienteResumoResponse {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

export interface AbrirSolicitacaoRequest {
  clienteId: number;
  descricaoEquipamento: string;
  categoriaId: number;
  descricaoDefeito: string;
}

export interface ItemOrcamentoRequest {
  tipo: 'PECA' | 'MAO_OBRA' | 'SERVICO';
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export interface EfetuarOrcamentoRequest {
  itens: ItemOrcamentoRequest[];
}

export interface ItemOrcamentoResponse {
  id: number;
  tipo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface OrcamentoResponse {
  id: number;
  versao: number;
  dataHora: string;
  itens: ItemOrcamentoResponse[];
  valorTotal: number;
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

  listarPorFuncionario(funcionarioId: number): Observable<SolicitacaoResponse[]> {
    return this.http.get<SolicitacaoResponse[]>(`${this.apiUrl}/funcionario/${funcionarioId}`);
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

  // RF010 — Efetua orçamento de uma solicitação
  efetuarOrcamento(solicitacaoId: number, request: EfetuarOrcamentoRequest, funcionarioId: number): Observable<OrcamentoResponse> {
    const headers = new HttpHeaders({ 'idUsuarioLogado': funcionarioId.toString() });
    return this.http.post<OrcamentoResponse>(`${this.apiUrl}/${solicitacaoId}/orcamento`, request, { headers });
  }
}
