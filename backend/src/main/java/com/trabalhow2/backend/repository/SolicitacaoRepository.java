package com.trabalhow2.backend.repository;

import com.trabalhow2.backend.model.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    List<Solicitacao> findByClienteIdOrderByDataHoraDesc(Long cliente_id);
 
} 
