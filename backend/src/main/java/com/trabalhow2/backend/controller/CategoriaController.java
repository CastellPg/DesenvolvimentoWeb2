package com.trabalhow2.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.trabalhow2.backend.controller.request.AtualizarCategoriaRequest;
import com.trabalhow2.backend.controller.request.CadastroCategoriaRequest;
import com.trabalhow2.backend.controller.response.CategoriaResponse;
import com.trabalhow2.backend.service.CategoriaService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @Autowired
    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> criarCategoria(@RequestBody @Valid CadastroCategoriaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.criarCategoria(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listarTodos() {
        return ResponseEntity.ok(categoriaService.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> atualizarCategoria(@PathVariable Long id,
                                                               @RequestBody @Valid AtualizarCategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.atualizarCategoria(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerCategoria(@PathVariable Long id) {
        categoriaService.removerCategoria(id);
        return ResponseEntity.noContent().build();
    }
}
