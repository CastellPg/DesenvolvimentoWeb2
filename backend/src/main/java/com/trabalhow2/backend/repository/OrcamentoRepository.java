package com.trabalhow2.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trabalhow2.backend.model.Orcamento;

@Repository
public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {

    List<Orcamento> findBySolicitacaoIdOrderByVersaoDesc(Long solicitacaoId);

    long countBySolicitacaoId(Long solicitacaoId);
}
