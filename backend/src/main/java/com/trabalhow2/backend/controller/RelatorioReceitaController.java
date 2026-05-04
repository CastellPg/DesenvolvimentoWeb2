package com.trabalhow2.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trabalhow2.backend.controller.response.ReceitaGeralResponse;
import com.trabalhow2.backend.controller.response.ReceitaPorCategoriaResponse;
import com.trabalhow2.backend.controller.response.ReceitaPorPeriodoResponse;
import com.trabalhow2.backend.service.RelatorioReceitaService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/relatorios/receitas")
@RequiredArgsConstructor
@Tag(name = "Relatórios de Receitas", description = "Relatórios de receitas por período, categoria e geral")
public class RelatorioReceitaController {

    private final RelatorioReceitaService service;

    @GetMapping("/periodo")
    public List<ReceitaPorPeriodoResponse> buscarPorPeriodo(
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate dataInicio,

        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate dataFim
    ) {
        return service.buscarPorPeriodo(dataInicio, dataFim);
    }

    @GetMapping("/periodo/pdf")
    public ResponseEntity<byte[]> gerarPdfPorPeriodo(
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate dataInicio,

        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate dataFim
    ) {
        return pdf(service.gerarPdfPorPeriodo(dataInicio, dataFim), "relatorio-receitas-periodo.pdf");
    }

    @GetMapping("/categorias")
    public List<ReceitaPorCategoriaResponse> buscarPorCategoria() {
        return service.buscarPorCategoria();
    }

    @GetMapping("/categorias/pdf")
    public ResponseEntity<byte[]> gerarPdfPorCategoria() {
        return pdf(service.gerarPdfPorCategoria(), "relatorio-receitas-categorias.pdf");
    }

    @GetMapping("/geral")
    public ReceitaGeralResponse buscarGeral() {
        return service.buscarGeral();
    }

    @GetMapping("/geral/pdf")
    public ResponseEntity<byte[]> gerarPdfGeral() {
        return pdf(service.gerarPdfGeral(), "relatorio-receitas-geral.pdf");
    }

    private ResponseEntity<byte[]> pdf(byte[] arquivo, String nomeArquivo) {
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .contentLength(arquivo.length)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nomeArquivo + "\"")
            .body(arquivo);
    }
}