package com.trabalhow2.backend.controller.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class CadastroClienteRequest {

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    @NotBlank(message = "CEP é obrigatório")
    private String cep;
    @NotBlank(message = "Logradouro é obrigatório")
    private String logradouro;
    @NotBlank(message = "Número é obrigatório")
    private String numero;
    private String complemento;
    @NotBlank(message = "Bairro é obrigatório")
    private String bairro;
    @NotBlank(message = "Cidade é obrigatório")
    private String cidade;
    @NotBlank(message = "Estado é obrigatório")
    private String estado;
    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;

}
