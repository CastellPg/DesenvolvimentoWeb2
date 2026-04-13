package com.trabalhow2.backend.controller;

import com.trabalhow2.backend.controller.request.AtualizarFuncionarioRequest;
import com.trabalhow2.backend.controller.request.CadastroFuncionarioRequest;
import com.trabalhow2.backend.controller.response.FuncionarioResponse;
import com.trabalhow2.backend.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<String> criarFuncionario(@RequestBody @Valid CadastroFuncionarioRequest request) {
        funcionarioService.criarFuncionario(request);
        return ResponseEntity.ok("Funcionário cadastrado com sucesso.");
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioResponse>> listarTodos() {
        return ResponseEntity.ok(funcionarioService.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarFuncionario(@PathVariable Long id, @RequestBody @Valid AtualizarFuncionarioRequest request) {
        funcionarioService.atualizarFuncionario(id, request);
        return ResponseEntity.ok("Funcionário atualizado com sucesso.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerFuncionario(
            @PathVariable Long id,
            @RequestHeader("idUsuarioLogado") Long idUsuarioLogado) {
        
        funcionarioService.removerFuncionario(id, idUsuarioLogado);
        return ResponseEntity.noContent().build();
    }
}