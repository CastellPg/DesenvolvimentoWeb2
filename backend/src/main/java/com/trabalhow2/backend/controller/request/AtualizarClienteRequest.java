package com.trabalhow2.backend.controller.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarClienteRequest {
    private String nome;
    private String email;
    private String telefone;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
}