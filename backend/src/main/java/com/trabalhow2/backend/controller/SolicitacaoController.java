package com.trabalhow2.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trabalhow2.backend.controller.request.AbrirSolicitacaoRequest;
import com.trabalhow2.backend.controller.request.RejeitarSolicitacaoRequest;
import com.trabalhow2.backend.controller.response.SolicitacaoResponse;
import com.trabalhow2.backend.service.SolicitacaoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:4200")
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

    // lista todas as solicitações ativas do cliente 
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorCliente(
            @PathVariable Long clienteId) {
        return ResponseEntity.ok(solicitacaoService.listarPorCliente(clienteId));
    }

    // RF005 — Cliente aprova o orçamento. 
    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<SolicitacaoResponse> aprovar(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.aprovarSolicitacao(id));
    }

    // RF005 — Cliente rejeita o orçamento com motivo obrigatório. 
    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<SolicitacaoResponse> rejeitar(
            @PathVariable Long id,
            @RequestBody @Valid RejeitarSolicitacaoRequest request) {
        return ResponseEntity.ok(solicitacaoService.rejeitarSolicitacao(id, request.motivo()));
    }
}
