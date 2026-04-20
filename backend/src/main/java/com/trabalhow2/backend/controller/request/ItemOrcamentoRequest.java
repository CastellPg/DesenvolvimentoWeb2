package com.trabalhow2.backend.controller.request;

import java.math.BigDecimal;

import com.trabalhow2.backend.model.enums.TipoItem;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ItemOrcamentoRequest(
    @NotNull(message = "Tipo é obrigatório")
    TipoItem tipo,
    @NotBlank(message = "Descrição é obrigatória")
    String descricao,
    @Min(value = 1, message = "Quantidade deve ser um valor positivo")
    int quantidade,
    @NotNull @DecimalMin(value = "0.01", message = "Valor unitário deve ser um valor positivo")
    BigDecimal valorUnitario
) {}
