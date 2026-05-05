package com.trabalhow2.backend.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.function.Consumer;

import org.springframework.stereotype.Service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import com.trabalhow2.backend.controller.response.ReceitaGeralResponse;
import com.trabalhow2.backend.controller.response.ReceitaPorCategoriaResponse;
import com.trabalhow2.backend.controller.response.ReceitaPorPeriodoResponse;

@Service
public class RelatorioReceitaPdfService {

    private static final Locale PT_BR = Locale.of("pt", "BR");
    private static final DateTimeFormatter DATA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final NumberFormat MOEDA_BR = NumberFormat.getCurrencyInstance(PT_BR);

    public byte[] gerarPorPeriodo(
        List<ReceitaPorPeriodoResponse> receitas,
        LocalDate dataInicio,
        LocalDate dataFim
    ) {
        return criarPdf("Relatório de Receitas por Período", document -> {
            document.add(new Paragraph("Período: " + descricaoPeriodo(dataInicio, dataFim)));

            Table table = new Table(UnitValue.createPercentArray(new float[] { 2, 2, 3 }))
                .useAllAvailableWidth();

            table.addHeaderCell(cabecalho("Data"));
            table.addHeaderCell(cabecalho("Qtd. Serviços"));
            table.addHeaderCell(cabecalho("Receita"));

            BigDecimal total = BigDecimal.ZERO;

            for (ReceitaPorPeriodoResponse receita : receitas) {
                total = total.add(receita.valorTotal());

                table.addCell(celula(formatarData(receita.data())));
                table.addCell(celula(String.valueOf(receita.quantidade())));
                table.addCell(celula(formatarMoeda(receita.valorTotal())));
            }

            document.add(table);
            document.add(new Paragraph("Total: " + formatarMoeda(total)).setBold());
        });
    }

    public byte[] gerarPorCategoria(List<ReceitaPorCategoriaResponse> categorias) {
        return criarPdf("Relatório de Receitas por Categoria", document -> {
            Table table = new Table(UnitValue.createPercentArray(new float[] { 4, 2, 3, 2 }))
                .useAllAvailableWidth();

            table.addHeaderCell(cabecalho("Categoria"));
            table.addHeaderCell(cabecalho("Qtd. Serviços"));
            table.addHeaderCell(cabecalho("Receita"));
            table.addHeaderCell(cabecalho("%"));

            BigDecimal total = BigDecimal.ZERO;

            for (ReceitaPorCategoriaResponse categoria : categorias) {
                total = total.add(categoria.valorTotal());

                table.addCell(celula(categoria.nome()));
                table.addCell(celula(String.valueOf(categoria.quantidade())));
                table.addCell(celula(formatarMoeda(categoria.valorTotal())));
                table.addCell(celula(categoria.percentual() + "%"));
            }

            document.add(table);
            document.add(new Paragraph("Total: " + formatarMoeda(total)).setBold());
        });
    }

    public byte[] gerarGeral(ReceitaGeralResponse geral) {
        return criarPdf("Relatório Geral de Receitas", document -> {
            Table table = new Table(UnitValue.createPercentArray(new float[] { 3, 3 }))
                .useAllAvailableWidth();

            table.addHeaderCell(cabecalho("Indicador"));
            table.addHeaderCell(cabecalho("Valor"));

            table.addCell(celula("Total de serviços pagos/finalizados"));
            table.addCell(celula(String.valueOf(geral.totalSolicitacoes())));

            table.addCell(celula("Receita total"));
            table.addCell(celula(formatarMoeda(geral.receitaTotal())));

            table.addCell(celula("Ticket médio"));
            table.addCell(celula(formatarMoeda(geral.ticketMedio())));

            document.add(table);
        });
    }

    private byte[] criarPdf(String titulo, Consumer<Document> conteudo) {
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(output);
            PdfDocument pdf = new PdfDocument(writer);

            try (Document document = new Document(pdf, PageSize.A4)) {
                document.add(new Paragraph(titulo).setBold().setFontSize(16));
                document.add(new Paragraph("Gerado em: " + LocalDate.now().format(DATA_BR)));
                document.add(new Paragraph(" "));

                conteudo.accept(document);
            }

            return output.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Erro ao gerar relatório em PDF.", e);
        }
    }

    private Cell cabecalho(String texto) {
        return new Cell()
            .add(new Paragraph(texto))
            .setBold()
            .setBackgroundColor(ColorConstants.LIGHT_GRAY);
    }

    private Cell celula(String texto) {
        return new Cell().add(new Paragraph(texto == null ? "" : texto));
    }

    private String descricaoPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        if (dataInicio == null && dataFim == null) {
            return "todos os períodos";
        }

        if (dataInicio != null && dataFim == null) {
            return "a partir de " + formatarData(dataInicio);
        }

        if (dataInicio == null) {
            return "até " + formatarData(dataFim);
        }

        return formatarData(dataInicio) + " até " + formatarData(dataFim);
    }

    private String formatarData(LocalDate data) {
        return data == null ? "" : data.format(DATA_BR);
    }

    private String formatarMoeda(BigDecimal valor) {
        return MOEDA_BR.format(valor == null ? BigDecimal.ZERO : valor);
    }
}