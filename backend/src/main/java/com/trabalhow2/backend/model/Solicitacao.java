package com.trabalhow2.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;


@Entity
@Table(name = "solicitacoes")
@Getter
@Setter
public class Solicitacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_hora_criacao")
    private LocalDateTime dataHora;

    @Column(name = "descricao_equipamento")
    private String equipamento;

    @Column(name = "descricao_defeito")
    private String descricaoDefeito;

    @Column(name = "estado")
    private String estado;

    @Column(name = "valor_orcamento")
    private Double valor;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
}
