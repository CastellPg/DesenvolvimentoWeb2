package com.trabalhow2.backend.service;

import com.trabalhow2.backend.controller.request.AtualizarFuncionarioRequest;
import com.trabalhow2.backend.controller.request.CadastroFuncionarioRequest;
import com.trabalhow2.backend.controller.response.FuncionarioResponse;
import com.trabalhow2.backend.model.Funcionario;
import com.trabalhow2.backend.model.Usuario;
import com.trabalhow2.backend.model.enums.Perfil;
import com.trabalhow2.backend.repository.FuncionarioRepository;
import com.trabalhow2.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Transactional
    public void criarFuncionario(CadastroFuncionarioRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new RuntimeException("E-mail já cadastrado no sistema.");
        }
        Usuario usuario = new Usuario();
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setSenha(request.senha());
        usuario.setSalt("salt_temporario"); 
        usuario.setPerfil(Perfil.FUNCIONARIO); 
        usuario.setAtivo(true);
        usuario = usuarioRepository.save(usuario);

        Funcionario funcionario = new Funcionario();
        funcionario.setUsuario(usuario);
        funcionario.setData_nascimento(request.data_nascimento());
        
        funcionarioRepository.save(funcionario);
    }
    public List<FuncionarioResponse> listarTodos() {
        return funcionarioRepository.findAll().stream()
                .map(f -> new FuncionarioResponse(
                        f.getId(),
                        f.getUsuario().getNome(),
                        f.getUsuario().getEmail(),
                        f.getData_nascimento()
                ))
                .collect(Collectors.toList());
    }
    @Transactional
    public void atualizarFuncionario(Long id, AtualizarFuncionarioRequest request) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

        Usuario usuario = funcionario.getUsuario();
        if (!usuario.getEmail().equals(request.email()) && usuarioRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Este e-mail já está sendo usado por outro usuário.");
        }
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuarioRepository.save(usuario);
        funcionario.setData_nascimento(request.data_nascimento());
        funcionarioRepository.save(funcionario);
    }
    @Transactional
    public void removerFuncionario(Long idAlvo, Long idLogado) {
        if (idAlvo.equals(idLogado)) {
            throw new RuntimeException("Você não pode remover a si mesmo do sistema.");
        }
        if (funcionarioRepository.count() <= 1) {
            throw new RuntimeException("O sistema deve ter pelo menos um funcionário cadastrado.");
        }
        funcionarioRepository.deleteById(idAlvo);
        usuarioRepository.deleteById(idAlvo);
    }
}