package com.trabalhow2.backend.controller.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record ConfirmarPagamentoRequest(
        @NotNull(message = "Valor pago e obrigatorio")
        @DecimalMin(value = "0.01", message = "Valor pago deve ser maior que zero")
        BigDecimal valorPago
) {}
