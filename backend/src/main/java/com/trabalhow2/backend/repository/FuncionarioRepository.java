package com.trabalhow2.backend.repository;

import com.trabalhow2.backend.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    @Query("select f from Funcionario f join fetch f.usuario order by f.id asc")
    List<Funcionario> findAllComUsuario();

    @Query(value = """
            SELECT f.*
            FROM funcionarios f
            LEFT JOIN solicitacoes s
                ON s.funcionario_responsavel_id = f.id
                AND s.ativo = true
            GROUP BY f.id
            ORDER BY COUNT(s.id) ASC, f.id ASC
            LIMIT 1
            """, nativeQuery = true)
    Optional<Funcionario> findFuncionarioComMenosSolicitacoes();
}
