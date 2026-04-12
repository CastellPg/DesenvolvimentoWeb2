package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Contrato de entrada para rejeição de um orçamento pelo cliente (RF005)
public record RejeitarSolicitacaoRequest(

        @NotBlank(message = "O motivo da rejeição é obrigatório.")
        @Size(max = 500, message = "O motivo deve ter no máximo 500 caracteres.")
        String motivo
) {}
