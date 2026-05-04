import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

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

export interface RejeitarOrcamentoRequest {
  motivo: string;
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

export interface RegistrarManutencaoRequest {
  descricaoManutencao: string;
  orientacoesCliente: string;
  pecasUsadas?: string;
  tempoGasto?: number;
}

export interface RedirecionarManutencaoRequest {
  funcionarioDestinoId: number;
  motivo: string;
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
    return this.http
      .get<ApiResponse<SolicitacaoResponse[]> | SolicitacaoResponse[]>(`${this.apiUrl}/cliente/${clienteId}`)
      .pipe(map(response => this.extrairLista(response)));
  }

  listarPorFuncionario(funcionarioId: number): Observable<SolicitacaoResponse[]> {
    return this.http
      .get<ApiResponse<SolicitacaoResponse[]> | SolicitacaoResponse[]>(`${this.apiUrl}/funcionario/${funcionarioId}`)
      .pipe(map(response => this.extrairLista(response)));
  }

  //Busca os detalhes de apenas uma solicitação
  buscarPorId(id: string | number): Observable<SolicitacaoResponse> {
    return this.http
      .get<ApiResponse<SolicitacaoResponse> | SolicitacaoResponse>(`${this.apiUrl}/${id}`)
      .pipe(map(response => this.extrairDados(response)));
  }

  // RF004
  abrirSolicitacao(request: AbrirSolicitacaoRequest): Observable<SolicitacaoResponse> {
    return this.http
      .post<ApiResponse<SolicitacaoResponse> | SolicitacaoResponse>(this.apiUrl, request)
      .pipe(map(response => this.extrairDados(response)));
  }

  //Busca categorias ativas
  getCategorias(): Observable<CategoriaResponse[]> {
    return this.http
      .get<ApiResponse<CategoriaResponse[]> | CategoriaResponse[]>(`${this.categoriasUrl}`)
      .pipe(map(response => this.extrairLista(response)));
  }

  // RF005 — Busca o orçamento mais recente com itens detalhados
  buscarUltimoOrcamento(id: number): Observable<OrcamentoResponse> {
    return this.http
      .get<ApiResponse<OrcamentoResponse> | OrcamentoResponse>(`${this.apiUrl}/${id}/orcamento`)
      .pipe(map(response => this.extrairDados(response)));
  }

  // RF010 — Efetua orçamento de uma solicitação
  efetuarOrcamento(solicitacaoId: number, request: EfetuarOrcamentoRequest, funcionarioId: number): Observable<OrcamentoResponse> {
    const headers = new HttpHeaders({ 'idUsuarioLogado': funcionarioId.toString() });
    return this.http
      .post<ApiResponse<OrcamentoResponse> | OrcamentoResponse>(`${this.apiUrl}/${solicitacaoId}/orcamento`, request, { headers })
      .pipe(map(response => this.extrairDados(response)));
  }

  aprovarOrcamento(solicitacaoId: number, clienteId: number): Observable<SolicitacaoResponse> {
    const headers = new HttpHeaders({ 'idUsuarioLogado': clienteId.toString() });
    return this.http
      .post<ApiResponse<SolicitacaoResponse> | SolicitacaoResponse>(`${this.apiUrl}/${solicitacaoId}/aprovar`, {}, { headers })
      .pipe(map(response => this.extrairDados(response)));
  }

  rejeitarOrcamento(solicitacaoId: number, request: RejeitarOrcamentoRequest, clienteId: number): Observable<SolicitacaoResponse> {
    const headers = new HttpHeaders({ 'idUsuarioLogado': clienteId.toString() });
    return this.http
      .post<ApiResponse<SolicitacaoResponse> | SolicitacaoResponse>(`${this.apiUrl}/${solicitacaoId}/rejeitar`, request, { headers })
      .pipe(map(response => this.extrairDados(response)));
  }

  // RF013 — Registra a manutenção realizada pelo técnico
  registrarManutencao(solicitacaoId: number, request: RegistrarManutencaoRequest, funcionarioId: number): Observable<SolicitacaoResponse> {
    const headers = new HttpHeaders({ 'idUsuarioLogado': funcionarioId.toString() });
    return this.http
      .post<ApiResponse<SolicitacaoResponse> | SolicitacaoResponse>(`${this.apiUrl}/${solicitacaoId}/manutencao`, request, { headers })
      .pipe(map(response => this.extrairDados(response)));
  }

  redirecionarManutencao(solicitacaoId: number, request: RedirecionarManutencaoRequest, funcionarioOrigemId: number): Observable<SolicitacaoResponse> {
    const headers = new HttpHeaders({ 'idUsuarioLogado': funcionarioOrigemId.toString() });
    return this.http
      .post<ApiResponse<SolicitacaoResponse> | SolicitacaoResponse>(`${this.apiUrl}/${solicitacaoId}/redirecionar`, request, { headers })
      .pipe(map(response => this.extrairDados(response)));
  }

  private extrairDados<T>(response: ApiResponse<T> | T): T {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as ApiResponse<T>).data;
    }

    return response as T;
  }

  private extrairLista<T>(response: ApiResponse<T[]> | T[]): T[] {
    const dados = this.extrairDados(response);
    return Array.isArray(dados) ? dados : [];
  }
}
