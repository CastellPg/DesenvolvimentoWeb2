package com.trabalhow2.backend.model;

import com.trabalhow2.backend.model.enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacoes")
@Getter
@Setter
@NoArgsConstructor
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lazy para evitar N+1 em listagens (RF013)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // FK para tabela categorias — carregado sob demanda
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    // Funcionário responsável — null ao criar; atribuído pelo staff (vide alter_solicitacoes.sql)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcionario_responsavel_id", nullable = true)
    private Funcionario funcionarioResponsavel;

    @Column(name = "descricao_equipamento", nullable = false, length = 50)
    private String descricaoEquipamento;

    @Column(name = "descricao_defeito", nullable = false, columnDefinition = "TEXT")
    private String descricaoDefeito;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 30)
    private StatusSolicitacao status;

    @Column(name = "data_hora_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    // BigDecimal para precisão monetária — nunca Double/Float
    @Column(name = "valor_orcamento", precision = 10, scale = 2)
    private BigDecimal valorOrcado;

    @Column(name = "motivo_rejeicao", columnDefinition = "TEXT")
    private String motivoRejeicao;

    // Soft delete — nunca excluímos registros fisicamente (vide alter_solicitacoes.sql)
    @Column(nullable = false)
    private boolean ativo = true;
}
