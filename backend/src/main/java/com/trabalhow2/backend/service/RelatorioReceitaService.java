package com.trabalhow2.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.trabalhow2.backend.controller.response.ReceitaGeralResponse;
import com.trabalhow2.backend.controller.response.ReceitaPorCategoriaResponse;
import com.trabalhow2.backend.controller.response.ReceitaPorPeriodoResponse;
import com.trabalhow2.backend.repository.RelatorioReceitaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RelatorioReceitaService {

    private final RelatorioReceitaRepository repository;
    private final RelatorioReceitaPdfService pdfService;

    public List<ReceitaPorPeriodoResponse> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        validarPeriodo(dataInicio, dataFim);
        return repository.buscarPorPeriodo(dataInicio, dataFim);
    }

    public List<ReceitaPorCategoriaResponse> buscarPorCategoria() {
        List<ReceitaPorCategoriaResponse> categorias = repository.buscarPorCategoria();

        BigDecimal total = categorias.stream()
            .map(ReceitaPorCategoriaResponse::valorTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return categorias;
        }

        return categorias.stream()
            .map(categoria -> new ReceitaPorCategoriaResponse(
                categoria.categoriaId(),
                categoria.nome(),
                categoria.quantidade(),
                categoria.valorTotal(),
                categoria.valorTotal()
                    .multiply(BigDecimal.valueOf(100))
                    .divide(total, 2, RoundingMode.HALF_UP)
            ))
            .toList();
    }

    public ReceitaGeralResponse buscarGeral() {
        ReceitaGeralResponse geral = repository.buscarGeral();

        BigDecimal ticketMedio = BigDecimal.ZERO;

        if (geral.totalSolicitacoes() > 0) {
            ticketMedio = geral.receitaTotal()
                .divide(BigDecimal.valueOf(geral.totalSolicitacoes()), 2, RoundingMode.HALF_UP);
        }

        return new ReceitaGeralResponse(
            geral.totalSolicitacoes(),
            geral.receitaTotal(),
            ticketMedio
        );
    }

    public byte[] gerarPdfPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        List<ReceitaPorPeriodoResponse> receitas = buscarPorPeriodo(dataInicio, dataFim);
        return pdfService.gerarPorPeriodo(receitas, dataInicio, dataFim);
    }

    public byte[] gerarPdfPorCategoria() {
        return pdfService.gerarPorCategoria(buscarPorCategoria());
    }

    public byte[] gerarPdfGeral() {
        return pdfService.gerarGeral(buscarGeral());
    }

    private void validarPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        if (dataInicio != null && dataFim != null && dataInicio.isAfter(dataFim)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A data inicial não pode ser maior que a data final."
            );
        }
    }
}