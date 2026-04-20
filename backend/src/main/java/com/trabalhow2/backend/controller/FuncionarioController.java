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
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    @Autowired
    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponse> criarFuncionario(@RequestBody @Valid CadastroFuncionarioRequest request) {
        return ResponseEntity.ok(funcionarioService.criarFuncionario(request));
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioResponse>> listarTodos() {
        return ResponseEntity.ok(funcionarioService.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarFuncionario(@PathVariable Long id,@RequestBody @Valid AtualizarFuncionarioRequest request) {
        log.info("Atualizando funcionário com ID: {}", id);
        funcionarioService.atualizarFuncionario(id, request);
        log.info("Funcionário atualizado com sucesso!");
        return ResponseEntity.ok("Funcionario atualizado com sucesso.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerFuncionario(@PathVariable Long id,@RequestHeader("idUsuarioLogado") Long idUsuarioLogado) {
        log.info("Removendo funcionário com ID: {}", id);
        funcionarioService.removerFuncionario(id, idUsuarioLogado);
        log.info("Funcionário removido com sucesso!");
        return ResponseEntity.noContent().build();
    }
}
