package com.trabalhow2.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trabalhow2.backend.controller.response.CategoriaResponse;
import com.trabalhow2.backend.repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    // lista categorias ativas 
    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listarAtivas() {
        List<CategoriaResponse> categorias = categoriaRepository.findByAtivoTrue()
                .stream()
                .map(c -> new CategoriaResponse(c.getId(), c.getNome()))
                .toList();
        return ResponseEntity.ok(categorias);
    }
}
