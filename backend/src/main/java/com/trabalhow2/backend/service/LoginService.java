package com.trabalhow2.backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

import com.trabalhow2.backend.exception.LoginErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trabalhow2.backend.model.Usuario;
import com.trabalhow2.backend.repository.UsuarioRepository;

@Service
public class LoginService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public LoginService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario autenticar(String email, String senhaPlana){
    
        String emailNormalizado = email.trim().toLowerCase();
        
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(emailNormalizado);

        if (usuarioOpt.isEmpty()) {
            throw new LoginErrorException();
        }

        Usuario usuario = usuarioOpt.get();

        if (!usuario.isAtivo()) {
            throw new LoginErrorException("Usuário desativado.");
        }

        String hashCalculado = gerarHash(senhaPlana, usuario.getSalt());

        if (hashCalculado.equals(usuario.getSenha())) {
            return usuario;
        } else {
            throw new LoginErrorException();
        }
    }

    private String gerarHash(String senha, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String senhaComSalt = senha + salt;
            byte[] hashBytes = md.digest(senhaComSalt.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao processar validação de segurança.", e);
        }
    }
}