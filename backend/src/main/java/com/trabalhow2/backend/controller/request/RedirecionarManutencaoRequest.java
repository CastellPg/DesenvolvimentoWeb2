package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RedirecionarManutencaoRequest(
        @NotNull(message = "O funcionario destino e obrigatorio")
        Long funcionarioDestinoId,

        @NotBlank(message = "O motivo do redirecionamento e obrigatorio")
        String motivo
) {}
