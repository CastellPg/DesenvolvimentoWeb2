package com.trabalhow2.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trabalhow2.backend.controller.request.AtualizarFuncionarioRequest;
import com.trabalhow2.backend.controller.request.CadastroFuncionarioRequest;
import com.trabalhow2.backend.controller.response.FuncionarioResponse;
import com.trabalhow2.backend.model.Funcionario;
import com.trabalhow2.backend.model.Usuario;
import com.trabalhow2.backend.model.enums.Perfil;
import com.trabalhow2.backend.repository.FuncionarioRepository;
import com.trabalhow2.backend.repository.UsuarioRepository;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public FuncionarioService(FuncionarioRepository funcionarioRepository, UsuarioRepository usuarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public FuncionarioResponse criarFuncionario(CadastroFuncionarioRequest request) {
        String emailNormalizado = normalizarEmail(request.email());

        if (usuarioRepository.existsByEmail(emailNormalizado)) {
            throw new RuntimeException("E-mail ja cadastrado no sistema.");
        }

        String salt = gerarSalt();
        String hash = gerarHash(request.senha(), salt);

        Usuario usuario = new Usuario();
        usuario.setNome(request.nome());
        usuario.setEmail(emailNormalizado);
        usuario.setSenha(hash);
        usuario.setSalt(salt);
        usuario.setPerfil(Perfil.FUNCIONARIO);
        usuario.setAtivo(true);
        usuario = usuarioRepository.save(usuario);

        Funcionario funcionario = new Funcionario();
        funcionario.setUsuario(usuario);
        funcionario.setData_nascimento(request.data_nascimento());
        funcionario = funcionarioRepository.save(funcionario);

        return converterParaFuncionarioResponse(funcionario);
    }

    public List<FuncionarioResponse> listarTodos() {
        return funcionarioRepository.findAll()
                .stream()
                .map(this::converterParaFuncionarioResponse)
                .toList();
    }

    @Transactional
    public void atualizarFuncionario(Long id, AtualizarFuncionarioRequest request) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionario nao encontrado."));

        Usuario usuario = funcionario.getUsuario();
        String emailNormalizado = normalizarEmail(request.email());

        if (!usuario.getEmail().equals(emailNormalizado) && usuarioRepository.existsByEmail(emailNormalizado)) {
            throw new RuntimeException("Este e-mail ja esta sendo usado por outro usuario.");
        }

        usuario.setNome(request.nome());
        usuario.setEmail(emailNormalizado);
        usuarioRepository.save(usuario);

        funcionario.setData_nascimento(request.data_nascimento());
        funcionarioRepository.save(funcionario);
    }

    @Transactional
    public void removerFuncionario(Long idAlvo, Long idLogado) {
        if (idAlvo.equals(idLogado)) {
            throw new RuntimeException("Voce nao pode remover a si mesmo do sistema.");
        }

        if (funcionarioRepository.count() <= 1) {
            throw new RuntimeException("O sistema deve ter pelo menos um funcionario cadastrado.");
        }

        funcionarioRepository.deleteById(idAlvo);
        usuarioRepository.deleteById(idAlvo);
    }

    private FuncionarioResponse converterParaFuncionarioResponse(Funcionario funcionario) {
        return new FuncionarioResponse(
                funcionario.getId(),
                funcionario.getUsuario().getNome(),
                funcionario.getUsuario().getEmail(),
                funcionario.getData_nascimento()
        );
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String gerarSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    private String gerarHash(String senha, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String senhaComSalt = senha + salt;
            byte[] hashBytes = md.digest(senhaComSalt.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash da senha.", e);
        }
    }
}
