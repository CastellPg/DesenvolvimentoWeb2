package com.trabalhow2.backend.controller.response;

import java.math.BigDecimal;

public record ReceitaPorCategoriaResponse(

    Long categoriaId,

    String nome,

    Long quantidade,

    BigDecimal valorTotal,

    BigDecimal percentual

) {}