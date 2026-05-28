package com.trabalhow2.backend.controller.response;

import com.trabalhow2.backend.model.HistoricoSolicitacao;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

public class HistoricoSolicitacaoResponse {

    @Schema(description = "Estado antes da mudanca (pode ser nulo na abertura)", example = "ABERTA")
    private String estadoAnterior;

    @Schema(description = "Novo estado atribuido a solicitacao", example = "ORCADA")
    private String estadoNovo;

    private LocalDateTime dataHora;

    @Schema(description = "Nome do usuario (cliente ou tecnico) responsavel pela acao", example = "Mariana Silva")
    private String nomeResponsavel;

    @Schema(description = "Detalhes da transicao", example = "Orcamento v1 registrado. Total: R$ 450.50")
    private String observacoes;

    @Schema(description = "Id do tecnico de origem quando houver redirecionamento", example = "3")
    private Long funcionarioOrigemId;

    @Schema(description = "Nome do tecnico de origem quando houver redirecionamento", example = "Carlos Souza")
    private String funcionarioOrigemNome;

    @Schema(description = "Id do tecnico de destino quando houver redirecionamento", example = "7")
    private Long funcionarioDestinoId;

    @Schema(description = "Nome do tecnico de destino quando houver redirecionamento", example = "Ana Lima")
    private String funcionarioDestinoNome;

    public HistoricoSolicitacaoResponse(HistoricoSolicitacao historico) {
        this.estadoAnterior = historico.getEstadoAnterior();
        this.estadoNovo = historico.getEstadoNovo();
        this.dataHora = historico.getDataHora();
        this.observacoes = historico.getObservacoes();
        this.nomeResponsavel = historico.getUsuarioResponsavel() != null
                ? historico.getUsuarioResponsavel().getNome()
                : "Sistema";

        if (historico.getFuncionarioOrigem() != null) {
            this.funcionarioOrigemId = historico.getFuncionarioOrigem().getId();
            this.funcionarioOrigemNome = historico.getFuncionarioOrigem().getUsuario() != null
                    ? historico.getFuncionarioOrigem().getUsuario().getNome()
                    : null;
        }

        if (historico.getFuncionarioDestino() != null) {
            this.funcionarioDestinoId = historico.getFuncionarioDestino().getId();
            this.funcionarioDestinoNome = historico.getFuncionarioDestino().getUsuario() != null
                    ? historico.getFuncionarioDestino().getUsuario().getNome()
                    : null;
        }
    }

    public String getEstadoAnterior() {
        return estadoAnterior;
    }

    public String getEstadoNovo() {
        return estadoNovo;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public String getNomeResponsavel() {
        return nomeResponsavel;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public Long getFuncionarioOrigemId() {
        return funcionarioOrigemId;
    }

    public String getFuncionarioOrigemNome() {
        return funcionarioOrigemNome;
    }

    public Long getFuncionarioDestinoId() {
        return funcionarioDestinoId;
    }

    public String getFuncionarioDestinoNome() {
        return funcionarioDestinoNome;
    }
}
