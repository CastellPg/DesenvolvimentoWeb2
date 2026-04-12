package com.trabalhow2.backend.repository;

import com.trabalhow2.backend.model.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    // Retorna apenas registros ativos (soft delete) — prevenção de SQL Injection via @Param
    @Query("SELECT s FROM Solicitacao s WHERE s.id = :id AND s.ativo = true")
    Optional<Solicitacao> findByIdAndAtivoTrue(@Param("id") Long id);

    @Query("SELECT s FROM Solicitacao s WHERE s.cliente.id = :clienteId AND s.ativo = true ORDER BY s.dataCriacao DESC")
    List<Solicitacao> findByClienteIdAndAtivoTrue(@Param("clienteId") Long clienteId);
}
