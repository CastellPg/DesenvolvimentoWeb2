package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.NotBlank;

public record RegistrarManutencaoRequest(
    @NotBlank String descricaoManutencao,
    @NotBlank String orientacoesCliente,
    String pecasUsadas,
    Integer tempoGasto
) {}
