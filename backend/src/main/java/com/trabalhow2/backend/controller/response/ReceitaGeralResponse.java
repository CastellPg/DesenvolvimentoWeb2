package com.trabalhow2.backend.controller.response;

import java.math.BigDecimal;

public record ReceitaGeralResponse(

    Long totalSolicitacoes,

    BigDecimal receitaTotal,

    BigDecimal ticketMedio

) {}