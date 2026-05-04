package com.trabalhow2.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "manutencoes")
@Getter
@Setter
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "solicitacao_id")
    private Solicitacao solicitacao;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(name = "descricao_manutencao", nullable = false, columnDefinition = "TEXT")
    private String descricaoManutencao;

    @Column(name = "orientacoes_cliente", nullable = false, columnDefinition = "TEXT")
    private String orientacoesCliente;

    // Peças efetivamente utilizadas (campo texto livre)
    @Column(name = "pecas_usadas", columnDefinition = "TEXT")
    private String pecasUsadas;

    // Tempo gasto em minutos
    @Column(name = "tempo_gasto")
    private Integer tempoGasto;
}
