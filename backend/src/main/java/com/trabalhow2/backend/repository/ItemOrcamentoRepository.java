package com.trabalhow2.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trabalhow2.backend.model.ItemOrcamento;

@Repository
public interface ItemOrcamentoRepository extends JpaRepository<ItemOrcamento, Long> {
}
