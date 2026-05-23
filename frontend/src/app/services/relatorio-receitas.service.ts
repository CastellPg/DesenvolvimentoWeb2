import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ReceitaPorPeriodo {
  data: string;
  quantidade: number;
  valorTotal: number;
}

export interface ReceitaPorCategoria {
  categoriaId: number;
  nome: string;
  quantidade: number;
  valorTotal: number;
  percentual: number;
}

export interface ReceitaGeral {
  totalSolicitacoes: number;
  receitaTotal: number;
  ticketMedio: number;
}

@Injectable({
  providedIn: 'root'
})
export class RelatorioReceitaService {
  private readonly apiUrl = 'http://localhost:8080/relatorios/receitas';

  constructor(private readonly http: HttpClient) {}

  buscarPorPeriodo(dataInicio?: string, dataFim?: string): Observable<ReceitaPorPeriodo[]> {
    let params = new HttpParams();

    if (dataInicio) {
      params = params.set('dataInicio', dataInicio);
    }

    if (dataFim) {
      params = params.set('dataFim', dataFim);
    }

    return this.http.get<ApiResponse<ReceitaPorPeriodo[]> | ReceitaPorPeriodo[]>(`${this.apiUrl}/periodo`, {
      params,
      withCredentials: true
    }).pipe(map((resposta) => this.extrairDados(resposta)));
  }

  gerarPdfPorPeriodo(dataInicio?: string, dataFim?: string): Observable<Blob> {
    let params = new HttpParams();

    if (dataInicio) {
      params = params.set('dataInicio', dataInicio);
    }

    if (dataFim) {
      params = params.set('dataFim', dataFim);
    }

    return this.http.get(`${this.apiUrl}/periodo/pdf`, {
      params,
      responseType: 'blob',
      withCredentials: true
    });
  }

  buscarPorCategoria(): Observable<ReceitaPorCategoria[]> {
    return this.http.get<ApiResponse<ReceitaPorCategoria[]> | ReceitaPorCategoria[]>(`${this.apiUrl}/categorias`, {
      withCredentials: true
    }).pipe(map((resposta) => this.extrairDados(resposta)));
  }

  gerarPdfPorCategoria(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/categorias/pdf`, {
      responseType: 'blob',
      withCredentials: true
    });
  }

  buscarGeral(): Observable<ReceitaGeral> {
    return this.http.get<ApiResponse<ReceitaGeral> | ReceitaGeral>(`${this.apiUrl}/geral`, {
      withCredentials: true
    }).pipe(map((resposta) => this.extrairDados(resposta)));
  }

  gerarPdfGeral(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/geral/pdf`, {
      responseType: 'blob',
      withCredentials: true
    });
  }

  private extrairDados<T>(resposta: ApiResponse<T> | T): T {
    if (resposta && typeof resposta === 'object' && 'data' in resposta) {
      return (resposta as ApiResponse<T>).data;
    }

    return resposta as T;
  }
}
