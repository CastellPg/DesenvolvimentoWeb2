package com.trabalhow2.backend.service;

import com.trabalhow2.backend.controller.request.CadastroClienteRequest;
import com.trabalhow2.backend.controller.response.ClienteResponse;
import com.trabalhow2.backend.model.Cliente;
import com.trabalhow2.backend.model.Usuario;
import com.trabalhow2.backend.model.enums.Perfil;
import com.trabalhow2.backend.repository.ClienteRepository;
import com.trabalhow2.backend.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Random;

@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository, UsuarioRepository usuarioRepository, EmailService emailService) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }


    private Usuario criarUsuario(CadastroClienteRequest request, String hash, String salt) {
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(normalizarEmail(request.getEmail()));
        usuario.setSenha(hash);
        usuario.setSalt(salt);
        usuario.setPerfil(Perfil.CLIENTE);
        return usuario;
    }

    private Cliente criarCliente(CadastroClienteRequest request, Usuario usuario) {
        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        cliente.setCpf(limparCpf(request.getCpf()));
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

    private String limparCpf(String cpf) {
        return cpf.replaceAll("\\D", "");
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase();
    }


    private String gerarSenhaTemporaria() {
        final Random random = new SecureRandom();
        return Integer.toString(random.nextInt(9000) + 1000);
    }

    private String gerarSalt() {
        final Random random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    private String gerarHash(String senhaTemporaria, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String senhaComSalt = senhaTemporaria + salt;
            byte[] hashBytes = md.digest(senhaComSalt.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash da senha.", e);
        }
    }

    private void validarCadastro(CadastroClienteRequest request) {
        //Mais validações colocar aqui
        if (request.getNome() == null || request.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email é obrigatório.");
        }
        String email = normalizarEmail(request.getEmail());
        if (request.getCpf() == null || request.getCpf().isBlank()) {
            throw new IllegalArgumentException("CPF é obrigatório.");
        }
        //Tira todos os carácteres não númericos
        String cpfLimpo = limparCpf(request.getCpf());
        if (cpfLimpo.length() != 11) {
            throw new IllegalArgumentException("CPF deve ter 11 dígitos.");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Email inválido.");
        }
        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email já cadastrado.");
        }
        if (clienteRepository.existsByCpf(cpfLimpo)){
            throw new IllegalArgumentException("CPF já cadastrado.");
        }
        if (request.getCep() == null || request.getCep().isBlank()) {
            throw new IllegalArgumentException("CEP é obrigatório.");
        }
        if (request.getLogradouro() == null || request.getLogradouro().isBlank()) {
            throw new IllegalArgumentException("Logradouro é obrigatório.");
        }
        if (request.getBairro() == null || request.getBairro().isBlank()) {
            throw new IllegalArgumentException("Bairro é obrigatório.");
        }
        if (request.getCidade() == null || request.getCidade().isBlank()) {
            throw new IllegalArgumentException("Cidade é obrigatória.");
        }
        if (request.getEstado() == null || request.getEstado().isBlank()) {
            throw new IllegalArgumentException("Estado é obrigatório.");
        }
    }

    //CRUD
    @Transactional
    public void cadastrarCliente(CadastroClienteRequest request) {
        validarCadastro(request);
        String senhaTemporaria = gerarSenhaTemporaria();
        String salt = gerarSalt();
        String hash = gerarHash(senhaTemporaria, salt);
        Usuario usuario = criarUsuario(request, hash, salt);
        usuarioRepository.save(usuario);
        Cliente cliente = criarCliente(request, usuario);
        clienteRepository.save(cliente);

        try {
            emailService.sendEmail(
                    normalizarEmail(request.getEmail()),
                    "Cadastro realizado!",
                    "Seu cadastro foi realizado com sucesso. Sua senha temporária é: " + senhaTemporaria
            );
        } catch (MailException e) {
            System.err.println("Erro ao enviar senha para o e-mail: " + e.getMessage());
            throw new RuntimeException("Falha ao enviar e-mail. Cadastro cancelado.", e);
        }
    }

    private ClienteResponse converterParaResponse(Cliente cliente) {
        ClienteResponse response = new ClienteResponse();
        response.setId(cliente.getId());
        response.setNome(cliente.getUsuario().getNome());
        response.setEmail(cliente.getUsuario().getEmail());
        response.setCpf(cliente.getCpf());
        response.setTelefone(cliente.getTelefone());
        response.setCep(cliente.getCep());
        response.setLogradouro(cliente.getLogradouro());
        response.setNumero(cliente.getNumero());
        response.setComplemento(cliente.getComplemento());
        response.setBairro(cliente.getBairro());
        response.setCidade(cliente.getCidade());
        response.setEstado(cliente.getEstado());
        return response;
    }

    public ClienteResponse buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        return converterParaResponse(cliente);
    }

    public List<ClienteResponse> listarTodos() {
        return clienteRepository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }


}
