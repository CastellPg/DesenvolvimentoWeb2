package com.trabalhow2.backend.repository;

import com.trabalhow2.backend.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

}
