package com.trabalhow2.backend.controller.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public record EfetuarOrcamentoRequest(
    @NotEmpty @Valid List<ItemOrcamentoRequest> itens
) {}
