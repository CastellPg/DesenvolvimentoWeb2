package com.trabalhow2.backend.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trabalhow2.backend.model.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByAtivoTrueOrderByIdAsc();

    Optional<Categoria> findByIdAndAtivoTrue(Long id);

    Optional<Categoria> findByNomeIgnoreCase(String nome);

    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);
}
