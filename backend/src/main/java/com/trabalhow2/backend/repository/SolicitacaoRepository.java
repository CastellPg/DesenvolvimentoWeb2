package com.trabalhow2.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trabalhow2.backend.model.Solicitacao;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    Optional<Solicitacao> findByIdAndAtivoTrue(Long id);

    List<Solicitacao> findByClienteIdAndAtivoTrueOrderByDataCriacaoAsc(Long clienteId);

    List<Solicitacao> findByFuncionarioIdAndAtivoTrueOrderByDataCriacaoAsc(Long funcionarioId);
} 
