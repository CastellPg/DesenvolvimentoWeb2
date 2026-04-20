package com.trabalhow2.backend.controller.request;

import java.math.BigDecimal;

import com.trabalhow2.backend.model.enums.TipoItem;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ItemOrcamentoRequest(
    @NotNull TipoItem tipo,
    @NotBlank String descricao,
    @Min(1) int quantidade,
    @NotNull @DecimalMin("0.01") BigDecimal valorUnitario
) {}
