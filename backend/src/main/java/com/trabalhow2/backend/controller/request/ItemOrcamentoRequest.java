package com.trabalhow2.backend.controller.request;

import java.math.BigDecimal;

import com.trabalhow2.backend.model.enums.TipoItem;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;

public record ItemOrcamentoRequest(
    @NotNull(message = "Tipo é obrigatório")
    @Schema(description = "Define se é uma PECA ou um SERVICO", example = "PECA")
    TipoItem tipo,
    @NotBlank(message = "Descrição é obrigatória")
    @Schema(description = "Descrição detalhada do item ou serviço", example = "Placa Mãe Asus H410M")
    String descricao,
    @Min(value = 1, message = "Quantidade deve ser um valor positivo")
    @Schema(description = "Quantidade utilizada", example = "1")
    int quantidade,
    @NotNull @DecimalMin(value = "0.01", message = "Valor unitário deve ser um valor positivo")
    @Schema(description = "Valor unitário do item (em Reais)", example = "450.50")
    BigDecimal valorUnitario
) {}
