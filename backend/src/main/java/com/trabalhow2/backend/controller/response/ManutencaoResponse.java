package com.trabalhow2.backend.controller.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record ManutencaoResponse(
    Long id,
    String descricaoManutencao,
    String orientacoesCliente,
    String pecasUsadas,
    Integer tempoGasto,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime dataHora,
    String funcionarioNome
) {}
