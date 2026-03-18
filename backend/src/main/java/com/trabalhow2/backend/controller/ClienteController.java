package com.trabalhow2.backend.controller;

import com.trabalhow2.backend.controller.request.AtualizarClienteRequest;
import com.trabalhow2.backend.controller.request.CadastroClienteRequest;
import com.trabalhow2.backend.controller.response.ClienteResponse;
import com.trabalhow2.backend.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

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
        clienteService.cadastrarCliente(request);
        return ResponseEntity.ok("Cliente cadastrado com sucesso.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> buscarPorId(@PathVariable Long id) {
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
