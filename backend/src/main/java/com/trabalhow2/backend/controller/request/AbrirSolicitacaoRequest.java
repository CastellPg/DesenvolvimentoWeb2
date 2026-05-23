package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record AbrirSolicitacaoRequest(

        @NotNull(message = "O ID do cliente é obrigatório.")
        Long clienteId,

        @NotBlank(message = "A descrição do equipamento é obrigatória.")
        @Size(max = 50, message = "A descrição do equipamento deve ter no máximo 50 caracteres.")
        String descricaoEquipamento,

        @NotNull(message = "A categoria do equipamento é obrigatória.")
        Long categoriaId,

        @NotBlank(message = "A descrição do defeito é obrigatória.")
        @Size(max = 1000, message = "A descrição do defeito deve ter no máximo 1000 caracteres.")
        String descricaoDefeito
) {}
