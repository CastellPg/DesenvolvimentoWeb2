package com.trabalhow2.backend.controller;

import com.trabalhow2.backend.controller.request.CadastroClienteRequest;
import com.trabalhow2.backend.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    private final ClienteService clienteService;

    @Autowired
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping("/cadastro")
    public void cadastroCliente(@RequestBody @Valid CadastroClienteRequest request) {
        clienteService.cadastroCliente(request);
    }


}
