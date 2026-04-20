package com.trabalhow2.backend.controller.response;

import java.math.BigDecimal;

public record ItemOrcamentoResponse(
    Long id,
    String tipo,
    String descricao,
    int quantidade,
    BigDecimal valorUnitario,
    BigDecimal valorTotal
) {}
