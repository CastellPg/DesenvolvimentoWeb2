package com.trabalhow2.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trabalhow2.backend.controller.request.AtualizarFuncionarioRequest;
import com.trabalhow2.backend.controller.request.CadastroFuncionarioRequest;
import com.trabalhow2.backend.controller.response.FuncionarioResponse;
import com.trabalhow2.backend.service.FuncionarioService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Slf4j
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/funcionarios")
@Tag(name = "Funcionários", description = "Endpoints para o gerenciamento de Funcionários (CRUD)")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    @Autowired
    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @Operation(summary = "Criar novo funcionário", description = "Cadastra um novo funcionário no sistema com e-mail único.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Funcionário criado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Erro de validação ou e-mail já cadastrado")
    })

    @PostMapping
    public ResponseEntity<FuncionarioResponse> criarFuncionario(@RequestBody @Valid CadastroFuncionarioRequest request) {
        return ResponseEntity.ok(funcionarioService.criarFuncionario(request));
    }

    @Operation(summary = "Listar todos os funcionários", description = "Retorna uma lista contendo todos os funcionários cadastrados no sistema.")
    @ApiResponse(responseCode = "200", description = "Listagem retornada com sucesso")

    @GetMapping
    public ResponseEntity<List<FuncionarioResponse>> listarTodos() {
        return ResponseEntity.ok(funcionarioService.listarTodos());
    }

    @Operation(summary = "Atualizar funcionário", description = "Atualiza os dados de um funcionário existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Funcionário atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Erro de validação dos campos informados"),
        @ApiResponse(responseCode = "404", description = "Funcionário não encontrado")
    })

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarFuncionario(@PathVariable Long id,@RequestBody @Valid AtualizarFuncionarioRequest request) {
        log.info("Atualizando funcionário com ID: {}", id);
        funcionarioService.atualizarFuncionario(id, request);
        log.info("Funcionário atualizado com sucesso!");
        return ResponseEntity.ok("Funcionario atualizado com sucesso.");
    }

    @Operation(summary = "Remover funcionário", description = "Remove um funcionário do sistema. Exige o envio do ID do usuário logado no Header, pois um funcionário não pode remover a si mesmo.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Funcionário removido com sucesso"),
        @ApiResponse(responseCode = "400", description = "Tentativa de autoexclusão ou exclusão do último funcionário"),
        @ApiResponse(responseCode = "404", description = "Funcionário não encontrado")
    })

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerFuncionario(@PathVariable Long id,@RequestHeader("idUsuarioLogado") Long idUsuarioLogado) {
        log.info("Removendo funcionário com ID: {}", id);
        funcionarioService.removerFuncionario(id, idUsuarioLogado);
        log.info("Funcionário removido com sucesso!");
        return ResponseEntity.noContent().build();
    }
}
