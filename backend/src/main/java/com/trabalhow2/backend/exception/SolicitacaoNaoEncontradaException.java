package com.trabalhow2.backend.exception;

public class SolicitacaoNaoEncontradaException extends RuntimeException {

    public SolicitacaoNaoEncontradaException(Long id) {
        super("Solicitação não encontrada com ID: " + id);
    }
}
