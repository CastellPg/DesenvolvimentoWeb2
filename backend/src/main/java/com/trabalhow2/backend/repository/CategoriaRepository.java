package com.trabalhow2.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trabalhow2.backend.model.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Retorna apenas categorias ativas para exibição no front-end
    List<Categoria> findByAtivoTrue();
}
