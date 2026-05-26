package com.trabalhow2.backend.controller.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter

public class CadastroClienteRequest {

    @NotBlank(message = "CPF é obrigatório")
    @Size(min = 11, max = 11, message = "CPF deve ser Válido")
    @Schema(description = "CPF do cliente contendo apenas números", example = "01234567890")
    private String cpf;
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Schema(description = "E-mail válido para login", example = "carlos.santos@email.com")
    private String email;
    @NotBlank(message = "Nome é obrigatório")
    @Schema(description = "Nome completo do cliente", example = "Carlos de Almeida Santos")
    private String nome;
    @NotBlank(message = "CEP é obrigatório")
    @Size(min = 8, max = 8, message = "CEP deve ser Válido")
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
     @Schema(description = "Telefone para contato com DDD", example = "41999999999")
    @Pattern(
        regexp = "^\\(\\d{2}\\) \\d{4,5}-\\d{4}$",
        message = "O telefone deve estar no formato (DDD) 9XXXX-XXXX ou (DDD) XXXX-XXXX"
    )
    private String telefone;

    public void setTelefone(String telefone) {
        this.telefone = telefone == null ? null : telefone.trim();
    }

}
