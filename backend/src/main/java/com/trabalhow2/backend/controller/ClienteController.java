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

@Slf4j
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    @Autowired
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastroCliente(@RequestBody @Valid CadastroClienteRequest request) {
        log.info("Iniciando cadastro para o e-mail: {}", request.getEmail());
        clienteService.cadastrarCliente(request);
        log.info("Cliente cadastrado com sucesso!");
        return ResponseEntity.ok("Cliente cadastrado com sucesso.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> buscarPorId(@PathVariable Long id) {
        log.info("Buscando cliente com ID: {}", id);
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listarTodos() {
        return ResponseEntity.ok(clienteService.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarCliente(@PathVariable Long id,
                                                   @RequestBody @Valid AtualizarClienteRequest request) {
        clienteService.atualizarCliente(id, request);
        return ResponseEntity.ok("Cliente atualizado com sucesso.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Long id){
        clienteService.deletarCliente(id);
        return ResponseEntity.noContent().build();
    }

}
