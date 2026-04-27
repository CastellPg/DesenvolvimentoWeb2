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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/categorias")
@Tag(name = "Categorias", description = "Endpoints para o gerenciamento de Categorias de Equipamentos (CRUD)")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @Autowired
    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @Operation(summary = "Criar nova categoria", description = "Cadastra uma nova categoria no sistema. O nome informado não pode ser repetido.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Categoria criada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Erro de validação (nome em branco ou já existente)")
    })

    @PostMapping
    public ResponseEntity<CategoriaResponse> criarCategoria(@RequestBody @Valid CadastroCategoriaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.criarCategoria(request));
    }

    @Operation(summary = "Buscar categoria por ID", description = "Retorna os detalhes de uma categoria específica baseada no seu ID único.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Categoria encontrada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Categoria não encontrada no sistema")
    })

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.buscarPorId(id));
    }

    @Operation(summary = "Listar todas as categorias", description = "Retorna uma lista contendo todas as categorias cadastradas e ativas.")
    @ApiResponse(responseCode = "200", description = "Listagem retornada com sucesso")

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listarTodos() {
        return ResponseEntity.ok(categoriaService.listarTodos());
    }

    @Operation(summary = "Atualizar categoria", description = "Atualiza o nome de uma categoria existente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Categoria atualizada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Erro de validação ou nome já em uso"),
        @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
    })

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> atualizarCategoria(@PathVariable Long id,
                                                               @RequestBody @Valid AtualizarCategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.atualizarCategoria(id, request));
    }

    @Operation(summary = "Remover categoria", description = "Remove ou desativa uma categoria do sistema através do seu ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Categoria removida com sucesso (Sem conteúdo)"),
        @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
    })

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerCategoria(@PathVariable Long id) {
        categoriaService.removerCategoria(id);
        return ResponseEntity.noContent().build();
    }
}
