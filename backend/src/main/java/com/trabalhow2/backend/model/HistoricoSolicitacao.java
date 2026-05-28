package com.trabalhow2.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico_solicitacao")
public class HistoricoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    @Column(name = "estado_anterior")
    private String estadoAnterior;

    @Column(name = "estado_novo", nullable = false)
    private String estadoNovo;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_responsavel_id")
    private Usuario usuarioResponsavel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_origem_id")
    private Funcionario funcionarioOrigem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_destino_id")
    private Funcionario funcionarioDestino;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    protected HistoricoSolicitacao() {
    }

    private HistoricoSolicitacao(
            Solicitacao solicitacao,
            String estadoAnterior,
            String estadoNovo,
            Usuario usuarioResponsavel,
            String observacoes,
            Funcionario funcionarioOrigem,
            Funcionario funcionarioDestino) {
        this.solicitacao = solicitacao;
        this.estadoAnterior = estadoAnterior;
        this.estadoNovo = estadoNovo;
        this.dataHora = LocalDateTime.now();
        this.usuarioResponsavel = usuarioResponsavel;
        this.observacoes = observacoes;
        this.funcionarioOrigem = funcionarioOrigem;
        this.funcionarioDestino = funcionarioDestino;
    }

    public static HistoricoSolicitacao criarRegistro(
            Solicitacao solicitacao,
            String estadoAnterior,
            String estadoNovo,
            Usuario responsavel,
            String observacoes) {
        return new HistoricoSolicitacao(
                solicitacao,
                estadoAnterior,
                estadoNovo,
                responsavel,
                observacoes,
                null,
                null
        );
    }

    public static HistoricoSolicitacao criarRegistroRedirecionamento(
            Solicitacao solicitacao,
            String estadoAnterior,
            String estadoNovo,
            Usuario responsavel,
            String observacoes,
            Funcionario funcionarioOrigem,
            Funcionario funcionarioDestino) {
        return new HistoricoSolicitacao(
                solicitacao,
                estadoAnterior,
                estadoNovo,
                responsavel,
                observacoes,
                funcionarioOrigem,
                funcionarioDestino
        );
    }

    public Long getId() {
        return id;
    }

    public Solicitacao getSolicitacao() {
        return solicitacao;
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

    public Usuario getUsuarioResponsavel() {
        return usuarioResponsavel;
    }

    public Funcionario getFuncionarioOrigem() {
        return funcionarioOrigem;
    }

    public Funcionario getFuncionarioDestino() {
        return funcionarioDestino;
    }

    public String getObservacoes() {
        return observacoes;
    }
}
