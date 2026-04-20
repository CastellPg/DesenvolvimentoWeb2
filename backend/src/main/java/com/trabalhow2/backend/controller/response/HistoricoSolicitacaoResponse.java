package com.trabalhow2.backend.controller.response;

import com.trabalhow2.backend.model.HistoricoSolicitacao;
import java.time.LocalDateTime;

public class HistoricoSolicitacaoResponse {
    
    private String estadoAnterior;
    private String estadoNovo;
    private LocalDateTime dataHora;
    private String nomeResponsavel;
    private String observacoes;

    // O construtor recebe a entidade e formata para a saída da API
    public HistoricoSolicitacaoResponse(HistoricoSolicitacao historico) {
        this.estadoAnterior = historico.getEstadoAnterior();
        this.estadoNovo = historico.getEstadoNovo();
        this.dataHora = historico.getDataHora();
        this.observacoes = historico.getObservacoes();
        
        if (historico.getUsuarioResponsavel() != null) {
            this.nomeResponsavel = historico.getUsuarioResponsavel().getNome();
        } else {
            this.nomeResponsavel = "Sistema";
        }
    }

    // Getters para o Spring transformar em JSON
    public String getEstadoAnterior() { return estadoAnterior; }
    public String getEstadoNovo() { return estadoNovo; }
    public LocalDateTime getDataHora() { return dataHora; }
    public String getNomeResponsavel() { return nomeResponsavel; }
    public String getObservacoes() { return observacoes; }
}