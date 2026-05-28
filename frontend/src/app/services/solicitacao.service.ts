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
  valorPago?: number | null;
  dataHoraPagamento?: string | null;
  pagamentoDivergente?: boolean;
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

export interface ConfirmarPagamentoRequest {
  valorPago: number;
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

export interface HistoricoSolicitacaoResponse {
  estadoAnterior: string | null;
  estadoNovo: string;
  dataHora: string;
  nomeResponsavel: string;
  observacoes: string | null;
  funcionarioOrigemId?: number | null;
  funcionarioOrigemNome?: string | null;
  funcionarioDestinoId?: number | null;
  funcionarioDestinoNome?: string | null;
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

  private montarHeadersUsuarioLogado(): HttpHeaders {
    const usuarioId = localStorage.getItem('usuarioId');
    return usuarioId
      ? new HttpHeaders({ idUsuarioLogado: usuarioId })
      : new HttpHeaders();
  }

  //Busca a lista do cliente
  listarPorCliente(clienteId: number): Observable<SolicitacaoResponse[]> {
    const headers = this.montarHeadersUsuarioLogado();
    return this.http
      .get<ApiResponse<SolicitacaoResponse[]> | SolicitacaoResponse[]>(`${this.apiUrl}/cliente/${clienteId}`, { headers })
      .pipe(map(response => this.extrairLista(response)));
  }

  listarPorFuncionario(funcionarioId: number): Observable<SolicitacaoResponse[]> {
    const headers = this.montarHeadersUsuarioLogado();
    return this.http
      .get<ApiResponse<SolicitacaoResponse[]> | SolicitacaoResponse[]>(`${this.apiUrl}/funcionario/${funcionarioId}`, { headers })
      .pipe(map(response => this.extrairLista(response)));
  }

  listarAbertas(): Observable<SolicitacaoResponse[]> {
    const headers = this.montarHeadersUsuarioLogado();
    return this.http
      .get<ApiResponse<SolicitacaoResponse[]> | SolicitacaoResponse[]>(`${this.apiUrl}/abertas`, { headers })
      .pipe(map(response => this.extrairLista(response)));
  }

  //Busca os detalhes de apenas uma solicitaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
  buscarPorId(id: string | number): Observable<SolicitacaoResponse> {
    const headers = this.montarHeadersUsuarioLogado();
    return this.http
      .get<ApiResponse<SolicitacaoResponse> | SolicitacaoResponse>(`${this.apiUrl}/${id}`, { headers })
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

  // RF005 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Busca o orÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§amento mais recente com itens detalhados
  buscarUltimoOrcamento(id: number): Observable<OrcamentoResponse> {
    const headers = this.montarHeadersUsuarioLogado();
    return this.http
      .get<ApiResponse<OrcamentoResponse> | OrcamentoResponse>(`${this.apiUrl}/${id}/orcamento`, { headers })
      .pipe(map(response => this.extrairDados(response)));
  }

  buscarHistorico(id: string | number): Observable<HistoricoSolicitacaoResponse[]> {
    const headers = this.montarHeadersUsuarioLogado();
    return this.http
      .get<ApiResponse<HistoricoSolicitacaoResponse[]> | HistoricoSolicitacaoResponse[] | null>(`${this.apiUrl}/${id}/historico`, { headers })
      .pipe(map(response => this.extrairLista(response)));
  }

  // RF010 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Efetua orÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§amento de uma solicitaÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o
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

  resgatarServico(solicitacaoId: number, clienteId: number): Observable<SolicitacaoResponse> {
    const headers = new HttpHeaders({ 'idUsuarioLogado': clienteId.toString() });
    return this.http
      .post<ApiResponse<SolicitacaoResponse> | SolicitacaoResponse>(`${this.apiUrl}/${solicitacaoId}/resgatar`, {}, { headers })
      .pipe(map(response => this.extrairDados(response)));
  }

  confirmarPagamento(solicitacaoId: number, clienteId: number, request: ConfirmarPagamentoRequest): Observable<SolicitacaoResponse> {
    const headers = new HttpHeaders({ 'idUsuarioLogado': clienteId.toString() });
    return this.http
      .post<ApiResponse<SolicitacaoResponse> | SolicitacaoResponse>(`${this.apiUrl}/${solicitacaoId}/pagamento`, request, { headers })
      .pipe(map(response => this.extrairDados(response)));
  }

  // RF013 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Registra a manutenÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£o realizada pelo tÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©cnico
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

  finalizarSolicitacao(solicitacaoId: number, funcionarioId: number): Observable<SolicitacaoResponse> {
    const headers = new HttpHeaders({ 'idUsuarioLogado': funcionarioId.toString() });
    return this.http
      .post<ApiResponse<SolicitacaoResponse> | SolicitacaoResponse>(`${this.apiUrl}/${solicitacaoId}/finalizar`, {}, { headers })
      .pipe(map(response => this.extrairDados(response)));
  }

  private extrairDados<T>(response: ApiResponse<T> | T): T {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as ApiResponse<T>).data;
    }

    return response as T;
  }

  private extrairLista<T>(response: ApiResponse<T[]> | T[] | null): T[] {
    const dados = this.extrairDados(response);
    return Array.isArray(dados) ? dados : [];
  }
}
