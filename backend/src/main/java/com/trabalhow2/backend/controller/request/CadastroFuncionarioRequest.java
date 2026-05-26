package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import io.swagger.v3.oas.annotations.media.Schema;
public record CadastroFuncionarioRequest(
        @NotBlank(message = "O nome e obrigatorio")
        @Schema(description = "Nome completo do funcionário", example = "Mariana Silva")
        String nome,

        @NotBlank(message = "O email e obrigatorio")
        @Email(message = "Formato de email invalido")
        @Schema(description = "E-mail corporativo para login", example = "mariana.silva@empresa.com")
        String email,

        @NotBlank(message = "A senha e obrigatoria")
        @Size(min = 4, max = 4, message = "A senha deve conter exatamente 4 digitos")
        @Pattern(regexp = "\\d{4}", message = "A senha deve conter apenas numeros")
        @Schema(description = "Senha provisória de acesso", example = "Admin@123")
        String senha,

        @NotNull(message = "A data de nascimento e obrigatoria")
        LocalDate data_nascimento
) {}
