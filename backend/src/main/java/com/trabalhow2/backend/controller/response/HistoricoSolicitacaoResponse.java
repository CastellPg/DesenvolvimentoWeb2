package com.trabalhow2.backend.controller.response;

import com.trabalhow2.backend.model.HistoricoSolicitacao;
import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema;

public class HistoricoSolicitacaoResponse {
    
    @Schema(description = "Estado antes da alteração (pode ser nulo na abertura)", example = "ABERTA")
    private String estadoAnterior;
    @Schema(description = "Novo estado atribuído à solicitação", example = "ORCADA")
    private String estadoNovo;
    private LocalDateTime dataHora;
    @Schema(description = "Nome do usuário (Cliente ou Técnico) que fez a ação", example = "Mariana Silva")
    private String nomeResponsavel;
    @Schema(description = "Detalhes automáticos ou manuais da alteração", example = "Orçamento v1 registrado. Total: R$ 450.50")
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