package com.trabalhow2.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trabalhow2.backend.controller.request.AbrirSolicitacaoRequest;
import com.trabalhow2.backend.controller.request.EfetuarOrcamentoRequest;
import com.trabalhow2.backend.controller.request.ItemOrcamentoRequest;
import com.trabalhow2.backend.controller.request.RejeitarOrcamentoRequest;
import com.trabalhow2.backend.controller.response.HistoricoSolicitacaoResponse;
import com.trabalhow2.backend.controller.response.ItemOrcamentoResponse;
import com.trabalhow2.backend.controller.response.OrcamentoResponse;
import com.trabalhow2.backend.controller.response.SolicitacaoResponse;
import com.trabalhow2.backend.controller.response.SolicitacaoResponse.ClienteResumoResponse;
import com.trabalhow2.backend.exception.SolicitacaoNaoEncontradaException;
import com.trabalhow2.backend.exception.TransicaoStatusInvalidaException;
import com.trabalhow2.backend.model.Categoria;
import com.trabalhow2.backend.model.Cliente;
import com.trabalhow2.backend.model.Funcionario;
import com.trabalhow2.backend.model.HistoricoSolicitacao;
import com.trabalhow2.backend.model.ItemOrcamento;
import com.trabalhow2.backend.model.Orcamento;
import com.trabalhow2.backend.model.Solicitacao;
import com.trabalhow2.backend.model.Usuario;
import com.trabalhow2.backend.model.enums.StatusSolicitacao;
import com.trabalhow2.backend.repository.CategoriaRepository;
import com.trabalhow2.backend.repository.ClienteRepository;
import com.trabalhow2.backend.repository.FuncionarioRepository;
import com.trabalhow2.backend.repository.HistoricoSolicitacaoRepository;
import com.trabalhow2.backend.repository.OrcamentoRepository;
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
    private final HistoricoSolicitacaoRepository historicoRepository;
    private final OrcamentoRepository orcamentoRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

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

        Solicitacao solicitacaoSalva = solicitacaoRepository.save(solicitacao);

        //Regista no histórico logo depois de criar a solicitação
        registrarMudancaHistorico(
                solicitacaoSalva, 
                null, // Sem estado anterior, ta abrindo agora
                StatusSolicitacao.ABERTA.name(), 
                cliente.getUsuario(), 
                "Solicitação aberta pelo cliente."
        );

        return paraResponse(solicitacaoSalva);
    }

    //Centraliza a criação do log para usar nos outros métodos (Aprovar, Rejeitar, etc)
    public void registrarMudancaHistorico(Solicitacao solicitacao, String estadoAnterior, String estadoNovo, Usuario responsavel, String observacoes) {
        HistoricoSolicitacao historico = HistoricoSolicitacao.criarRegistro(
                solicitacao, 
                estadoAnterior, 
                estadoNovo, 
                responsavel, 
                observacoes
        );
        historicoRepository.save(historico);

        if (estadoAnterior != null && !estadoAnterior.equals(estadoNovo)){
                eventPublisher.publishEvent(new com.trabalhow2.backend.model.MudancaEstadoEvent(solicitacao, estadoAnterior, estadoNovo));
        }
    }

    //Busca a linha do tempo completa para a tela do Front
    @Transactional(readOnly = true)
    public List<HistoricoSolicitacaoResponse> buscarHistorico(Long solicitacaoId) {
        return historicoRepository.findBySolicitacaoIdOrderByDataHoraAsc(solicitacaoId)
                .stream()
                .map(HistoricoSolicitacaoResponse::new)
                .toList();
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

    // RF005 — Busca o orçamento mais recente de uma solicitação com os itens detalhados
    @Transactional(readOnly = true)
    public OrcamentoResponse buscarUltimoOrcamento(Long solicitacaoId) {
        solicitacaoRepository.findByIdAndAtivoTrue(solicitacaoId)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(solicitacaoId));
        return orcamentoRepository.findBySolicitacaoIdOrderByVersaoDesc(solicitacaoId)
                .stream()
                .findFirst()
                .map(this::paraOrcamentoResponse)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Nenhum orçamento encontrado para a solicitação #" + solicitacaoId));
    }

    // RF010 — Efetua o orçamento de uma solicitação
    @Transactional
    public OrcamentoResponse efetuarOrcamento(Long solicitacaoId, EfetuarOrcamentoRequest request, Long funcionarioId) {
        Solicitacao solicitacao = solicitacaoRepository.findByIdAndAtivoTrue(solicitacaoId)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(solicitacaoId));

        if (solicitacao.getStatus() != StatusSolicitacao.ABERTA) {
            throw new IllegalArgumentException(
                    "A solicitação #" + solicitacaoId + " não está com status ABERTA (status atual: " + solicitacao.getStatus() + ").");
        }

        Funcionario funcionario = funcionarioRepository.findById(funcionarioId)
                .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado com ID: " + funcionarioId));

        int versao = (int) orcamentoRepository.countBySolicitacaoId(solicitacaoId) + 1;

        Orcamento orcamento = new Orcamento();
        orcamento.setSolicitacao(solicitacao);
        orcamento.setFuncionario(funcionario);
        orcamento.setDataHora(LocalDateTime.now());
        orcamento.setVersao(versao);

        BigDecimal valorTotal = BigDecimal.ZERO;
        for (ItemOrcamentoRequest itemReq : request.itens()) {
            ItemOrcamento item = new ItemOrcamento();
            item.setOrcamento(orcamento);
            item.setTipo(itemReq.tipo());
            item.setDescricao(itemReq.descricao());
            item.setQuantidade(itemReq.quantidade());
            item.setValorUnitario(itemReq.valorUnitario());
            BigDecimal itemTotal = itemReq.valorUnitario().multiply(BigDecimal.valueOf(itemReq.quantidade()));
            item.setValorTotal(itemTotal);
            orcamento.getItens().add(item);
            valorTotal = valorTotal.add(itemTotal);
        }

        orcamento.setValorTotal(valorTotal);

        solicitacao.setValorOrcado(valorTotal);
        solicitacao.setStatus(StatusSolicitacao.ORCADA);

        Orcamento orcamentoSalvo = orcamentoRepository.save(orcamento);
        solicitacaoRepository.save(solicitacao);

        registrarMudancaHistorico(
                solicitacao,
                StatusSolicitacao.ABERTA.name(),
                StatusSolicitacao.ORCADA.name(),
                funcionario.getUsuario(),
                "Orçamento v" + versao + " registrado. Total: R$ " + valorTotal
        );

        return paraOrcamentoResponse(orcamentoSalvo);
    }

    // RF011 - Aprova o orcamento de uma solicitacao pelo cliente
    @Transactional
    public SolicitacaoResponse aprovarOrcamento(Long solicitacaoId, Long clienteId) {
        Solicitacao solicitacao = buscarSolicitacaoOrcadaDoCliente(solicitacaoId, clienteId);
        Cliente cliente = solicitacao.getCliente();

        solicitacao.setStatus(StatusSolicitacao.APROVADA);
        solicitacao.setMotivoRejeicao(null);

        Solicitacao solicitacaoSalva = solicitacaoRepository.save(solicitacao);

        registrarMudancaHistorico(
                solicitacaoSalva,
                StatusSolicitacao.ORCADA.name(),
                StatusSolicitacao.APROVADA.name(),
                cliente.getUsuario(),
                "Orcamento aprovado pelo cliente."
        );

        return paraResponse(solicitacaoSalva);
    }

    // RF012 - Rejeita o orcamento de uma solicitacao pelo cliente
    @Transactional
    public SolicitacaoResponse rejeitarOrcamento(Long solicitacaoId, RejeitarOrcamentoRequest request, Long clienteId) {
        Solicitacao solicitacao = buscarSolicitacaoOrcadaDoCliente(solicitacaoId, clienteId);
        Cliente cliente = solicitacao.getCliente();
        String motivo = request.motivo().trim();

        solicitacao.setStatus(StatusSolicitacao.REJEITADA);
        solicitacao.setMotivoRejeicao(motivo);

        Solicitacao solicitacaoSalva = solicitacaoRepository.save(solicitacao);

        registrarMudancaHistorico(
                solicitacaoSalva,
                StatusSolicitacao.ORCADA.name(),
                StatusSolicitacao.REJEITADA.name(),
                cliente.getUsuario(),
                "Orcamento rejeitado pelo cliente. Motivo: " + motivo
        );

        return paraResponse(solicitacaoSalva);
    }

    private Solicitacao buscarSolicitacaoOrcadaDoCliente(Long solicitacaoId, Long clienteId) {
        Solicitacao solicitacao = solicitacaoRepository.findByIdAndAtivoTrue(solicitacaoId)
                .orElseThrow(() -> new SolicitacaoNaoEncontradaException(solicitacaoId));

        if (solicitacao.getStatus() != StatusSolicitacao.ORCADA) {
            throw new TransicaoStatusInvalidaException(
                    "A solicitacao #" + solicitacaoId + " deve estar ORCADA para aprovar ou rejeitar (status atual: "
                            + solicitacao.getStatus() + ").");
        }

        if (solicitacao.getCliente() == null || !solicitacao.getCliente().getId().equals(clienteId)) {
            throw new IllegalArgumentException("Solicitacao nao pertence ao cliente informado.");
        }

        return solicitacao;
    }

    private OrcamentoResponse paraOrcamentoResponse(Orcamento orcamento) {
        List<ItemOrcamentoResponse> itensResponse = orcamento.getItens().stream()
                .map(item -> new ItemOrcamentoResponse(
                        item.getId(),
                        item.getTipo().name(),
                        item.getDescricao(),
                        item.getQuantidade(),
                        item.getValorUnitario(),
                        item.getValorTotal()
                ))
                .toList();
        return new OrcamentoResponse(
                orcamento.getId(),
                orcamento.getVersao(),
                orcamento.getDataHora(),
                itensResponse,
                orcamento.getValorTotal()
        );
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
