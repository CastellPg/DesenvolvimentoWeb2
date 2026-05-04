package com.trabalhow2.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trabalhow2.backend.model.Manutencao;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {

    List<Manutencao> findBySolicitacaoId(Long solicitacaoId);
}
