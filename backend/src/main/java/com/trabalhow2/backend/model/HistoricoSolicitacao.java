package com.trabalhow2.backend.model;

import jakarta.persistence.*;
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

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    // Construtor vazio (obrigatório para o JPA)
    protected HistoricoSolicitacao() {}

    // Construtor privado para forçar o uso do Factory Method
    private HistoricoSolicitacao(Solicitacao solicitacao, String estadoAnterior, String estadoNovo, Usuario usuarioResponsavel, String observacoes) {
        this.solicitacao = solicitacao;
        this.estadoAnterior = estadoAnterior;
        this.estadoNovo = estadoNovo;
        this.dataHora = LocalDateTime.now(); // Regra de negócio isolada aqui
        this.usuarioResponsavel = usuarioResponsavel;
        this.observacoes = observacoes;
    }

    // PADRÃO DE PROJETO: Factory Method
    // Oculta a complexidade da instanciação e protege a dataHora de ser adulterada
    public static HistoricoSolicitacao criarRegistro(Solicitacao solicitacao, String estadoAnterior, String estadoNovo, Usuario responsavel, String observacoes) {
        return new HistoricoSolicitacao(solicitacao, estadoAnterior, estadoNovo, responsavel, observacoes);
    }

    
    public Long getId() { return id; }
    public Solicitacao getSolicitacao() { return solicitacao; }
    public String getEstadoAnterior() { return estadoAnterior; }
    public String getEstadoNovo() { return estadoNovo; }
    public LocalDateTime getDataHora() { return dataHora; }
    public Usuario getUsuarioResponsavel() { return usuarioResponsavel; }
    public String getObservacoes() { return observacoes; }
}