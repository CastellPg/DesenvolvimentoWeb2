import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/solicitacoes';

  //Busca a lista do cliente
  listarPorCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  //Busca os detalhes de apenas uma solicitação
  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
