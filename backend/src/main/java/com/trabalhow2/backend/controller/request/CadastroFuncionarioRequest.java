package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record CadastroFuncionarioRequest(
        @NotBlank(message = "O nome é obrigatório")
        String nome,
        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Formato de email inválido")
        String email,
        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, message = "A senha deve conter no mínimo 6 caracteres")
        @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$",
        message = "O campo deve conter pelo menos uma letra maiúscula e um caractere especial"
        )
        String senha,

        @NotNull(message = "A data de nascimento é obrigatória")
        LocalDate data_nascimento
) {}