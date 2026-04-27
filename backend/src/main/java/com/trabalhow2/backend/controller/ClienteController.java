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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trabalhow2.backend.controller.request.AtualizarClienteRequest;
import com.trabalhow2.backend.controller.request.CadastroClienteRequest;
import com.trabalhow2.backend.controller.response.ClienteResponse;
import com.trabalhow2.backend.service.ClienteService;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Slf4j
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/clientes")
@Tag(name = "Clientes", description = "Endpoints para o gerenciamento de Clientes e Autocadastro")
public class ClienteController {

    private final ClienteService clienteService;

    @Autowired
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @Operation(summary = "Autocadastro de Cliente (RF001)", description = "Permite que qualquer pessoa se cadastre no sistema. Uma senha aleatória será gerada e enviada para o e-mail informado.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente cadastrado com sucesso e e-mail enviado"),
        @ApiResponse(responseCode = "400", description = "Erro de validação (ex: CPF ou E-mail já existentes no sistema)")
    })

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastroCliente(@RequestBody @Valid CadastroClienteRequest request) {
        log.info("Iniciando cadastro para o e-mail: {}", request.getEmail());
        clienteService.cadastrarCliente(request);
        log.info("Cliente cadastrado com sucesso!");
        return ResponseEntity.ok("Cliente cadastrado com sucesso.");
    }

    @Operation(summary = "Buscar cliente por ID", description = "Retorna os detalhes completos de um cliente específico pelo seu ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente encontrado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Cliente não encontrado")
    })

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> buscarPorId(@PathVariable Long id) {
        log.info("Buscando cliente com ID: {}", id);
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    @Operation(summary = "Listar todos os clientes", description = "Retorna uma lista com todos os clientes cadastrados no sistema.")
    @ApiResponse(responseCode = "200", description = "Listagem retornada com sucesso")

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listarTodos() {
        return ResponseEntity.ok(clienteService.listarTodos());
    }

    @Operation(summary = "Atualizar cliente", description = "Atualiza as informações cadastrais de um cliente existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Erro de validação nos dados enviados"),
        @ApiResponse(responseCode = "404", description = "Cliente não encontrado")
    })

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarCliente(@PathVariable Long id,
                                                   @RequestBody @Valid AtualizarClienteRequest request) {
        clienteService.atualizarCliente(id, request);
        return ResponseEntity.ok("Cliente atualizado com sucesso.");
    }

    @Operation(summary = "Remover cliente", description = "Remove ou desativa um cliente do sistema através do seu ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Cliente removido com sucesso"),
        @ApiResponse(responseCode = "404", description = "Cliente não encontrado")
    })

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Long id){
        clienteService.deletarCliente(id);
        return ResponseEntity.noContent().build();
    }

}
