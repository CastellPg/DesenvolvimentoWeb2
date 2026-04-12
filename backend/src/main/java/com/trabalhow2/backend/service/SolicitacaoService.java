package com.trabalhow2.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trabalhow2.backend.controller.request.AbrirSolicitacaoRequest;
import com.trabalhow2.backend.controller.response.SolicitacaoResponse;
import com.trabalhow2.backend.exception.SolicitacaoNaoEncontradaException;
import com.trabalhow2.backend.model.Categoria;
import com.trabalhow2.backend.model.Cliente;
import com.trabalhow2.backend.model.Solicitacao;
import com.trabalhow2.backend.model.enums.StatusSolicitacao;
import com.trabalhow2.backend.repository.CategoriaRepository;
import com.trabalhow2.backend.repository.ClienteRepository;
import com.trabalhow2.backend.repository.SolicitacaoRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final ClienteRepository clienteRepository;
    private final CategoriaRepository categoriaRepository;

    // RF004 — Abre nova solicitação de manutenção com status ABERTA
    @Transactional
    public SolicitacaoResponse abrirSolicitacao(AbrirSolicitacaoRequest request) {
        Cliente cliente = clienteRepository.findById(request.clienteId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cliente não encontrado com ID: " + request.clienteId()));

        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Categoria não encontrada com ID: " + request.categoriaId()));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setCliente(cliente);
        solicitacao.setDescricaoEquipamento(request.descricaoEquipamento());
        solicitacao.setCategoria(categoria);
        solicitacao.setDescricaoDefeito(request.descricaoDefeito());
        solicitacao.setStatus(StatusSolicitacao.ABERTA);
        solicitacao.setDataCriacao(LocalDateTime.now());

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
        return solicitacaoRepository.findByClienteIdAndAtivoTrue(clienteId)
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    // Cliente aprova o orçamento — transição ORCADA → APROVADA
    @Transactional
    public SolicitacaoResponse aprovarSolicitacao(Long id) {
        Solicitacao solicitacao = solicitacaoRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(id));

        if (solicitacao.getStatus() != StatusSolicitacao.ORCADA) {
            throw new IllegalStateException(
                    "Não é possível aprovar: status atual é " + solicitacao.getStatus());
        }

        solicitacao.setStatus(StatusSolicitacao.APROVADA);
        return paraResponse(solicitacaoRepository.save(solicitacao));
    }

    // Cliente rejeita o orçamento — transição ORCADA → REJEITADA
    @Transactional
    public SolicitacaoResponse rejeitarSolicitacao(Long id, String motivo) {
        Solicitacao solicitacao = solicitacaoRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(id));

        if (solicitacao.getStatus() != StatusSolicitacao.ORCADA) {
            throw new IllegalStateException(
                    "Não é possível rejeitar: status atual é " + solicitacao.getStatus());
        }

        solicitacao.setStatus(StatusSolicitacao.REJEITADA);
        solicitacao.setMotivoRejeicao(motivo);
        return paraResponse(solicitacaoRepository.save(solicitacao));
    }

    // Converte entidade → DTO; o Controller nunca deve tocar na entidade
    private SolicitacaoResponse paraResponse(Solicitacao s) {
        return new SolicitacaoResponse(
                s.getId(),
                s.getDescricaoEquipamento(),
                s.getCategoria() != null ? s.getCategoria().getNome() : null,
                s.getDescricaoDefeito(),
                s.getStatus().name(),
                s.getDataCriacao(),
                s.getValorOrcado(),
                s.getMotivoRejeicao()
        );
    }
}

