package com.trabalhow2.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trabalhow2.backend.controller.request.AbrirSolicitacaoRequest;
import com.trabalhow2.backend.controller.response.SolicitacaoResponse;
import com.trabalhow2.backend.controller.response.SolicitacaoResponse.ClienteResumoResponse;
import com.trabalhow2.backend.exception.SolicitacaoNaoEncontradaException;
import com.trabalhow2.backend.model.Categoria;
import com.trabalhow2.backend.model.Cliente;
import com.trabalhow2.backend.model.Funcionario;
import com.trabalhow2.backend.model.Solicitacao;
import com.trabalhow2.backend.model.enums.StatusSolicitacao;
import com.trabalhow2.backend.repository.CategoriaRepository;
import com.trabalhow2.backend.repository.ClienteRepository;
import com.trabalhow2.backend.repository.FuncionarioRepository;
import com.trabalhow2.backend.repository.SolicitacaoRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final ClienteRepository clienteRepository;
    private final CategoriaRepository categoriaRepository;
    private final FuncionarioRepository funcionarioRepository;

    @Transactional
    public SolicitacaoResponse abrirSolicitacao(AbrirSolicitacaoRequest request) {
        Cliente cliente = clienteRepository.findById(request.clienteId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cliente nao encontrado com ID: " + request.clienteId()));

        Categoria categoria = categoriaRepository.findByIdAndAtivoTrue(request.categoriaId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Categoria nao encontrada com ID: " + request.categoriaId()));

        Funcionario funcionarioResponsavel = funcionarioRepository.findFuncionarioComMenosSolicitacoes()
                .orElseThrow(() -> new IllegalStateException(
                        "Nenhum funcionario cadastrado para receber solicitacoes."));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setCliente(cliente);
        solicitacao.setDescricaoEquipamento(request.descricaoEquipamento());
        solicitacao.setCategoria(categoria);
        solicitacao.setDescricaoDefeito(request.descricaoDefeito());
        solicitacao.setStatus(StatusSolicitacao.ABERTA);
        solicitacao.setDataCriacao(LocalDateTime.now());
        solicitacao.setFuncionario(funcionarioResponsavel);

        return paraResponse(solicitacaoRepository.save(solicitacao));
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponse buscarPorId(Long id) {
        Solicitacao solicitacao = solicitacaoRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(id));
        return paraResponse(solicitacao);
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listarPorCliente(Long clienteId) {
        return solicitacaoRepository.findByClienteIdAndAtivoTrueOrderByDataCriacaoAsc(clienteId)
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listarPorFuncionario(Long funcionarioId) {
        return solicitacaoRepository.findByFuncionarioIdAndAtivoTrueOrderByDataCriacaoAsc(funcionarioId)
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    private SolicitacaoResponse paraResponse(Solicitacao solicitacao) {
        return new SolicitacaoResponse(
                solicitacao.getId(),
                solicitacao.getDescricaoEquipamento(),
                solicitacao.getCategoria() != null ? solicitacao.getCategoria().getNome() : null,
                solicitacao.getDescricaoDefeito(),
                solicitacao.getStatus().name(),
                solicitacao.getDataCriacao(),
                solicitacao.getValorOrcado(),
                solicitacao.getMotivoRejeicao(),
                paraClienteResumo(solicitacao.getCliente())
        );
    }

    private ClienteResumoResponse paraClienteResumo(Cliente cliente) {
        if (cliente == null) {
            return null;
        }

        return new ClienteResumoResponse(
                cliente.getId(),
                cliente.getUsuario() != null ? cliente.getUsuario().getNome() : "",
                cliente.getUsuario() != null ? cliente.getUsuario().getEmail() : "",
                cliente.getCpf(),
                cliente.getTelefone(),
                montarEndereco(cliente)
        );
    }

    private String montarEndereco(Cliente cliente) {
        return List.of(
                        cliente.getLogradouro(),
                        cliente.getNumero(),
                        cliente.getComplemento(),
                        cliente.getBairro(),
                        cliente.getCidade(),
                        cliente.getEstado()
                )
                .stream()
                .filter(valor -> valor != null && !valor.isBlank())
                .reduce((parte1, parte2) -> parte1 + ", " + parte2)
                .orElse("");
    }
}
