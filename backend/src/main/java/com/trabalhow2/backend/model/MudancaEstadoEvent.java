package com.trabalhow2.backend.model;

import com.trabalhow2.backend.model.Solicitacao;

public record MudancaEstadoEvent(

    Solicitacao solicitacao,
    String estadoAnterior,
    String estadoNovo
) {}
