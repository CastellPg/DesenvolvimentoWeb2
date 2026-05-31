package com.trabalhow2.backend.repository;

import com.trabalhow2.backend.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    @Query("select f from Funcionario f join fetch f.usuario u where u.ativo = true order by f.id asc")
    List<Funcionario> findAllComUsuario();

    Optional<Funcionario> findByIdAndUsuarioAtivoTrue(Long id);

    long countByUsuarioAtivoTrue();
}
