package com.trabalhow2.backend.controller.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrcamentoResponse(
    Long id,
    int versao,
    LocalDateTime dataHora,
    List<ItemOrcamentoResponse> itens,
    BigDecimal valorTotal
) {}
