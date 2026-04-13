package com.trabalhow2.backend.controller.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;


// Contrato de saida para exibição de uma solicitação de manutenção (RF004/RF005)
public record SolicitacaoResponse(

        Long id,
        String descricaoEquipamento,
        String categoria,
        String descricaoDefeito,
        String status,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime dataCriacao,

        BigDecimal valorOrcado,
        String motivoRejeicao
) {}
