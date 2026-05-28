package com.trabalhow2.backend.repository;

import com.trabalhow2.backend.model.Cliente;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByCpf(String cpf);

    Optional<Cliente> findByIdAndUsuarioAtivoTrue(Long id);

    List<Cliente> findByUsuarioAtivoTrue();

    boolean existsByCpfAndUsuarioAtivoTrue(@NotBlank String cpf);
}
