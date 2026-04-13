package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CadastroFuncionarioRequest(
        @NotBlank(message = "O nome é obrigatório")
        String nome,
        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Formato de email inválido")
        String email,
        @NotBlank(message = "A senha é obrigatória")
        String senha,

        @NotNull(message = "A data de nascimento é obrigatória")
        LocalDate data_nascimento
) {}