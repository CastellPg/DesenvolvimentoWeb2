package com.trabalhow2.backend.controller.response;

import java.time.LocalDate;

public record FuncionarioResponse(
        Long id,
        String nome,
        String email,
        LocalDate data_nascimento
) {}