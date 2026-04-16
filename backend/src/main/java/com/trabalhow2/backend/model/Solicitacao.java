package com.trabalhow2.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.trabalhow2.backend.model.enums.StatusSolicitacao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "solicitacoes")
@Getter
@Setter
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Column(name = "descricao_equipamento")
    private String descricaoEquipamento;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Column(name = "descricao_defeito")
    private String descricaoDefeito;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private StatusSolicitacao status;

    @Column(name = "data_hora_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "valor_orcamento")
    private BigDecimal valorOrcado;

    @Column(name = "motivo_rejeicao")
    private String motivoRejeicao;

    @ManyToOne
    @JoinColumn(name = "funcionario_responsavel_id", nullable = true)
    private Funcionario funcionario;

    @Column(nullable = false)
    private boolean ativo = true;
}
