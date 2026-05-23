package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.NotBlank;

public record RejeitarOrcamentoRequest(
        @NotBlank(message = "O motivo da rejeição é obrigatório")
        String motivo
) {}
