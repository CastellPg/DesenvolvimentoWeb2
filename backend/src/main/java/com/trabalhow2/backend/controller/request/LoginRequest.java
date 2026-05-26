package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Schema(description = "E-mail cadastrado no sistema (Cliente ou Funcionário)", example = "admin@empresa.com")
    private String email;
    @NotBlank(message = "Senha é obrigatório")
    @Schema(description = "Senha de acesso do usuário", example = "SenhaSegura@123")
    private String senha;
}
