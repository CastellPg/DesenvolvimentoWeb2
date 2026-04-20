package com.trabalhow2.backend.repository;

import com.trabalhow2.backend.model.HistoricoSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoSolicitacaoRepository extends JpaRepository<HistoricoSolicitacao, Long> {
    
    // Spring Data cria a query SQL para listar ordenado pela data
    List<HistoricoSolicitacao> findBySolicitacaoIdOrderByDataHoraAsc(Long solicitacaoId);
}