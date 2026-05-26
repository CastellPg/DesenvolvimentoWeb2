package com.trabalhow2.backend.controller.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import io.swagger.v3.oas.annotations.media.Schema;

public record EfetuarOrcamentoRequest(
    @Schema(description = "Lista de peças e serviços que compõem este orçamento")
    @NotEmpty @Valid List<ItemOrcamentoRequest> itens
) {}
