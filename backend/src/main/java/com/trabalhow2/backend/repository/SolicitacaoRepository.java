package com.trabalhow2.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trabalhow2.backend.model.Solicitacao;

import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.trabalhow2.backend.model.enums.StatusSolicitacao;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    Optional<Solicitacao> findByIdAndAtivoTrue(Long id);

    List<Solicitacao> findByClienteIdAndAtivoTrueOrderByDataCriacaoAsc(Long clienteId);
    
    List<Solicitacao> findByStatusAndAtivoTrueOrderByDataCriacaoAsc(StatusSolicitacao status);
    
    List<Solicitacao> findByFuncionarioIdAndAtivoTrueOrderByDataCriacaoAsc(Long funcionarioId);

    @Query("""
           SELECT s
           FROM Solicitacao s
           WHERE s.ativo = true
             AND (s.status <> :statusRedirecionada OR s.funcionario.id = :funcionarioId)
           ORDER BY s.dataCriacao ASC
           """)
    List<Solicitacao> listarParaVisualizacaoFuncionario(
            @Param("funcionarioId") Long funcionarioId,
            @Param("statusRedirecionada") StatusSolicitacao statusRedirecionada
    );

    @Query("SELECT s FROM Solicitacao s WHERE s.ativo = true " +
           "AND (:status IS NULL OR s.status = :status) " +
           "AND (:categoriaId IS NULL OR s.categoria.id = :categoriaId) " +
           "AND (:funcionarioId IS NULL OR s.funcionario.id = :funcionarioId) " +
           "AND (cast(:dataInicio as timestamp) IS NULL OR s.dataCriacao >= :dataInicio) " +
           "AND (cast(:dataFim as timestamp) IS NULL OR s.dataCriacao <= :dataFim)")
    Page<Solicitacao> buscarComFiltrosPaginado(
            @Param("status") StatusSolicitacao status,
            @Param("categoriaId") Long categoriaId,
            @Param("funcionarioId") Long funcionarioId,
            @Param("dataInicio") LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dataFim,
            Pageable pageable
    );
} 
