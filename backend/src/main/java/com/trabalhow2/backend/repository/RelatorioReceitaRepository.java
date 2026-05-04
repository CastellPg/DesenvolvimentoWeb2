package com.trabalhow2.backend.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.trabalhow2.backend.controller.response.ReceitaGeralResponse;
import com.trabalhow2.backend.controller.response.ReceitaPorCategoriaResponse;
import com.trabalhow2.backend.controller.response.ReceitaPorPeriodoResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RelatorioReceitaRepository {

    private static final List<String> STATUS_RECEITA = List.of("PAGA", "FINALIZADA");

    private static final String JOIN_ULTIMO_ORCAMENTO = """
        JOIN (
            SELECT solicitacao_id, MAX(versao) AS versao
            FROM orcamentos
            GROUP BY solicitacao_id
        ) ultimo ON ultimo.solicitacao_id = o.solicitacao_id
                 AND ultimo.versao = o.versao
        """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public List<ReceitaPorPeriodoResponse> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        String sql = """
            SELECT
                DATE(o.data_hora) AS data,
                COUNT(DISTINCT s.id) AS quantidade,
                COALESCE(SUM(o.valor_total), 0) AS valor_total
            FROM orcamentos o
        """ + JOIN_ULTIMO_ORCAMENTO + """
            JOIN solicitacoes s ON s.id = o.solicitacao_id
            WHERE s.ativo = true
              AND s.estado IN (:status)
              AND (:inicio IS NULL OR o.data_hora >= :inicio)
              AND (:fim IS NULL OR o.data_hora < :fim)
            GROUP BY DATE(o.data_hora)
            ORDER BY DATE(o.data_hora)
            """;

        return jdbcTemplate.query(sql, parametrosPeriodo(dataInicio, dataFim), (rs, rowNum) ->
            new ReceitaPorPeriodoResponse(
                rs.getDate("data").toLocalDate(),
                rs.getLong("quantidade"),
                valorOuZero(rs.getBigDecimal("valor_total"))
            )
        );
    }

    public List<ReceitaPorCategoriaResponse> buscarPorCategoria() {
        String sql = """
            SELECT
                c.id AS categoria_id,
                c.nome AS nome,
                COUNT(DISTINCT s.id) AS quantidade,
                COALESCE(SUM(o.valor_total), 0) AS valor_total
            FROM orcamentos o
        """ + JOIN_ULTIMO_ORCAMENTO + """
            JOIN solicitacoes s ON s.id = o.solicitacao_id
            JOIN categorias c ON c.id = s.categoria_id
            WHERE s.ativo = true
              AND s.estado IN (:status)
            GROUP BY c.id, c.nome
            ORDER BY c.nome
            """;

        return jdbcTemplate.query(sql, parametrosBase(), (rs, rowNum) ->
            new ReceitaPorCategoriaResponse(
                rs.getLong("categoria_id"),
                rs.getString("nome"),
                rs.getLong("quantidade"),
                valorOuZero(rs.getBigDecimal("valor_total")),
                BigDecimal.ZERO
            )
        );
    }

    public ReceitaGeralResponse buscarGeral() {
        String sql = """
            SELECT
                COUNT(DISTINCT s.id) AS total_solicitacoes,
                COALESCE(SUM(o.valor_total), 0) AS receita_total
            FROM orcamentos o
        """ + JOIN_ULTIMO_ORCAMENTO + """
            JOIN solicitacoes s ON s.id = o.solicitacao_id
            WHERE s.ativo = true
              AND s.estado IN (:status)
            """;

        return jdbcTemplate.queryForObject(sql, parametrosBase(), (rs, rowNum) ->
            new ReceitaGeralResponse(
                rs.getLong("total_solicitacoes"),
                valorOuZero(rs.getBigDecimal("receita_total")),
                BigDecimal.ZERO
            )
        );
    }

    private MapSqlParameterSource parametrosBase() {
        return new MapSqlParameterSource()
            .addValue("status", STATUS_RECEITA);
    }

    private MapSqlParameterSource parametrosPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        LocalDateTime inicio = dataInicio == null ? null : dataInicio.atStartOfDay();
        LocalDateTime fim = dataFim == null ? null : dataFim.plusDays(1).atStartOfDay();

        return parametrosBase()
            .addValue("inicio", inicio)
            .addValue("fim", fim);
    }

    private BigDecimal valorOuZero(BigDecimal valor) {
        return valor == null ? BigDecimal.ZERO : valor;
    }
}