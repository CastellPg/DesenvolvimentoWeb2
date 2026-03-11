package com.trabalhow2.backend.service;

import com.trabalhow2.backend.controller.request.CadastroClienteRequest;
import com.trabalhow2.backend.model.Cliente;
import com.trabalhow2.backend.model.Usuario;
import com.trabalhow2.backend.repository.ClienteRepository;
import com.trabalhow2.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Random;

@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository, UsuarioRepository usuarioRepository) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }


    private Usuario criarUsuario(CadastroClienteRequest request, String hash, String salt) {
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(hash);
        usuario.setSalt(salt);
        return usuario;
    }

    private Cliente criarCliente(CadastroClienteRequest request, Usuario usuario) {
        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        cliente.setCpf(request.getCpf());
        cliente.setTelefone(request.getTelefone());
        cliente.setCep(request.getCep());
        cliente.setLogradouro(request.getLogradouro());
        cliente.setNumero(request.getNumero());
        cliente.setComplemento(request.getComplemento());
        cliente.setBairro(request.getBairro());
        cliente.setCidade(request.getCidade());
        cliente.setEstado(request.getEstado());
        return cliente;
    }

    private String gerarSenhaTemporaria() {
        Random random = new Random();
        return Integer.toString(random.nextInt(9000) + 1000);
    }

    private String gerarSalt() {
        final Random random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    private String gerarHash(String senhaTemporaria, String salt) {
        //Ainda não sei fazer
    }


    public void cadastroCliente(CadastroClienteRequest request) {
        //Falta validação dos campos
        Usuario usuario;
        Cliente cliente;
        String senhaTemporaria = gerarSenhaTemporaria();
        String salt = gerarSalt();
        String hash = gerarHash(senhaTemporaria, salt);
        usuario = criarUsuario(request, hash, salt);
        usuarioRepository.save(usuario);
        cliente = criarCliente(request, usuario);
        clienteRepository.save(cliente);
        //Falta fazer mandar por email
    }
}
