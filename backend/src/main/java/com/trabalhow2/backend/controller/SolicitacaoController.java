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
import com.trabalhow2.backend.controller.request.RejeitarOrcamentoRequest;
import com.trabalhow2.backend.controller.response.HistoricoSolicitacaoResponse;
import com.trabalhow2.backend.controller.response.OrcamentoResponse;
import com.trabalhow2.backend.controller.response.SolicitacaoResponse;
import com.trabalhow2.backend.service.SolicitacaoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/solicitacoes")
@RequiredArgsConstructor
@Tag(name = "Solicitações e Orçamentos", description = "Endpoints para o gerenciamento do fluxo de manutenção, histórico de estados e orçamentos")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    // RF004 — Abre uma nova solicitação de manutenção

    @Operation(summary = "Abrir Solicitação de Manutenção (RF004)", description = "O cliente registra uma nova solicitação. O estado inicial será definido automaticamente como ABERTA.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Solicitação aberta com sucesso"),
        @ApiResponse(responseCode = "400", description = "Erro de validação nos dados enviados")
    })

    @PostMapping
    public ResponseEntity<SolicitacaoResponse> abrirSolicitacao(
            @RequestBody @Valid AbrirSolicitacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(solicitacaoService.abrirSolicitacao(request));
    }

    // RF005 — Busca os detalhes de uma solicitação para exibição do orçamento

    @Operation(summary = "Mostrar detalhes e orçamento (RF005)", description = "Retorna todos os dados de uma solicitação específica. Usado para o cliente aprovar/rejeitar serviços.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitação encontrada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Solicitação não encontrada")
    })

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.buscarPorId(id));
    }

    @Operation(summary = "Listar solicitações por Cliente (RF003)", description = "Retorna todas as solicitações pertencentes a um cliente específico.")
    @ApiResponse(responseCode = "200", description = "Listagem retornada com sucesso")

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(solicitacaoService.listarPorCliente(clienteId));
    }

    @Operation(summary = "Listar solicitações por Funcionário (RF011/RF013)", description = "Retorna as solicitações vinculadas a um funcionário (Abertas, Redirecionadas, etc).")
    @ApiResponse(responseCode = "200", description = "Listagem retornada com sucesso")

    @GetMapping("/funcionario/{funcionarioId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorFuncionario(@PathVariable Long funcionarioId) {
        return ResponseEntity.ok(solicitacaoService.listarPorFuncionario(funcionarioId));
    }

    //ENDPOINT RF008 — Busca o histórico de alterações de estado de uma solicitação

    @Operation(summary = "Visualizar Histórico do Serviço (RF008)", description = "Retorna a linha do tempo (timeline) completa de todas as mudanças de estado da solicitação (Data, Hora e Responsável).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Histórico retornado com sucesso"),
        @ApiResponse(responseCode = "204", description = "Nenhum histórico encontrado (Sem conteúdo)"),
        @ApiResponse(responseCode = "404", description = "Solicitação não encontrada")
    })

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

    @Operation(summary = "Efetuar Orçamento (RF012)", description = "O funcionário cadastra o valor orçado para o serviço. A solicitação passa para o estado ORÇADA. Exige o Header idUsuarioLogado.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Orçamento registrado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Erro na regra de negócio (ex: solicitação já orçada)"),
        @ApiResponse(responseCode = "404", description = "Solicitação ou funcionário não encontrados")
    })

    @PostMapping("/{id}/orcamento")
    public ResponseEntity<OrcamentoResponse> efetuarOrcamento(
            @PathVariable Long id,
            @RequestBody @Valid EfetuarOrcamentoRequest request,
            @RequestHeader("idUsuarioLogado") Long funcionarioId) {
        OrcamentoResponse response = solicitacaoService.efetuarOrcamento(id, request, funcionarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // RF011 - Aprova o orcamento de uma solicitacao
    @PostMapping("/{id}/aprovar")
    public ResponseEntity<SolicitacaoResponse> aprovarOrcamento(
            @PathVariable Long id,
            @RequestHeader("idUsuarioLogado") Long clienteId) {
        return ResponseEntity.ok(solicitacaoService.aprovarOrcamento(id, clienteId));
    }

    // RF012 - Rejeita o orcamento de uma solicitacao
    @PostMapping("/{id}/rejeitar")
    public ResponseEntity<SolicitacaoResponse> rejeitarOrcamento(
            @PathVariable Long id,
            @RequestBody @Valid RejeitarOrcamentoRequest request,
            @RequestHeader("idUsuarioLogado") Long clienteId) {
        return ResponseEntity.ok(solicitacaoService.rejeitarOrcamento(id, request, clienteId));
    }
}
