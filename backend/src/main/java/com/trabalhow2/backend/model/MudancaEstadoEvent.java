package com.trabalhow2.backend.model;

public record MudancaEstadoEvent(

    Solicitacao solicitacao,
    String estadoAnterior,
    String estadoNovo
) {}
