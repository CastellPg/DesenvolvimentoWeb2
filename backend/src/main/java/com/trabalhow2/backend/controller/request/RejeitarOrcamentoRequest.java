package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.NotBlank;

public record RejeitarOrcamentoRequest(
        @NotBlank(message = "O motivo da rejeicao e obrigatorio")
        String motivo
) {}
