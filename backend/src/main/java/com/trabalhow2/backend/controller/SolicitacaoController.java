package com.trabalhow2.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trabalhow2.backend.controller.request.AbrirSolicitacaoRequest;
import com.trabalhow2.backend.controller.request.EfetuarOrcamentoRequest;
import com.trabalhow2.backend.controller.response.HistoricoSolicitacaoResponse;
import com.trabalhow2.backend.controller.response.OrcamentoResponse;
import com.trabalhow2.backend.controller.response.SolicitacaoResponse;
import com.trabalhow2.backend.service.SolicitacaoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    // RF004 — Abre uma nova solicitação de manutenção
    @PostMapping
    public ResponseEntity<SolicitacaoResponse> abrirSolicitacao(
            @RequestBody @Valid AbrirSolicitacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(solicitacaoService.abrirSolicitacao(request));
    }

    // RF005 — Busca os detalhes de uma solicitação para exibição do orçamento
    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.buscarPorId(id));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(solicitacaoService.listarPorCliente(clienteId));
    }

    @GetMapping("/funcionario/{funcionarioId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorFuncionario(@PathVariable Long funcionarioId) {
        return ResponseEntity.ok(solicitacaoService.listarPorFuncionario(funcionarioId));
    }

    //ENDPOINT RF008 — Busca o histórico de alterações de estado de uma solicitação
    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoSolicitacaoResponse>> listarHistorico(@PathVariable Long id) {
        List<HistoricoSolicitacaoResponse> historico = solicitacaoService.buscarHistorico(id);
        
        //se a lista estiver vazia, retorna 204 No Content
        if (historico.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        
        return ResponseEntity.ok(historico);
    }

    // RF005 — Busca o orçamento mais recente com os itens detalhados para exibição ao cliente
    @GetMapping("/{id}/orcamento")
    public ResponseEntity<OrcamentoResponse> buscarUltimoOrcamento(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.buscarUltimoOrcamento(id));
    }

    // RF010 — Efetua o orçamento de uma solicitação
    @PostMapping("/{id}/orcamento")
    public ResponseEntity<OrcamentoResponse> efetuarOrcamento(
            @PathVariable Long id,
            @RequestBody @Valid EfetuarOrcamentoRequest request,
            @RequestHeader("idUsuarioLogado") Long funcionarioId) {
        OrcamentoResponse response = solicitacaoService.efetuarOrcamento(id, request, funcionarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}