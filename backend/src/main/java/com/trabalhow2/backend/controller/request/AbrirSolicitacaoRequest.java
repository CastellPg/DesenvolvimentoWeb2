package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

public record AbrirSolicitacaoRequest(

        @NotNull(message = "O ID do cliente é obrigatório.")
        @Schema(description = "ID numérico do cliente que está abrindo a OS", example = "1")
        Long clienteId,

        @NotBlank(message = "A descrição do equipamento é obrigatória.")
        @Size(max = 50, message = "A descrição do equipamento deve ter no máximo 50 caracteres.")
        @Schema(description = "Marca e modelo exato do equipamento", example = "Notebook Dell Inspiron 15 3000")
        String descricaoEquipamento,

        @NotNull(message = "A categoria do equipamento é obrigatória.")
        @Schema(description = "ID numérico da categoria do equipamento", example = "2")
        Long categoriaId,

        @NotBlank(message = "A descrição do defeito é obrigatória.")
        @Size(max = 1000, message = "A descrição do defeito deve ter no máximo 1000 caracteres.")
        @Schema(description = "Relato detalhado do problema apresentado", example = "A tela está piscando e a bateria não segura carga por mais de 10 minutos.")
        String descricaoDefeito
) {}
