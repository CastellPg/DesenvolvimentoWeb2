package com.trabalhow2.backend.controller.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaResponse {
    @Schema(description = "ID único gerado pelo banco de dados", example = "1")
    private Long id;
    @Schema(description = "Nome da categoria cadastrada", example = "Manutenção Preventiva")
    private String nome;
}
