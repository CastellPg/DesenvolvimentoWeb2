package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
public class CadastroCategoriaRequest {

    @NotBlank(message = "Nome da categoria é obrigatório.")
    @Size(max = 50, message = "Nome da categoria deve ter no máximo 50 caracteres.")
    @Schema(description = "Nome único da categoria de equipamento", example = "Manutenção Preventiva")
    private String nome;
}
