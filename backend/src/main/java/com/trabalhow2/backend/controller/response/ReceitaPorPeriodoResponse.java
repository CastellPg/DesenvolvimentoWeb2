package com.trabalhow2.backend.controller.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

public record ReceitaPorPeriodoResponse(

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    LocalDate data,

    Long quantidade,

    BigDecimal valorTotal

) {}