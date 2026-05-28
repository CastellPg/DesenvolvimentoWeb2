package com.trabalhow2.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trabalhow2.backend.controller.request.AbrirSolicitacaoRequest;
import com.trabalhow2.backend.controller.request.ConfirmarPagamentoRequest;
import com.trabalhow2.backend.controller.request.EfetuarOrcamentoRequest;
import com.trabalhow2.backend.controller.request.RedirecionarManutencaoRequest;
import com.trabalhow2.backend.controller.request.RegistrarManutencaoRequest;
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
@Tag(
        name = "Solicitações e Orçamentos",
        description = "Endpoints para gerenciamento do fluxo de manutenção, orçamento e histórico de solicitações"
)
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    @Operation(
            summary = "Abrir Solicitação de Manutenção (RF004)",
            description = "Cliente registra nova solicitação com estado inicial ABERTA."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Solicitação aberta com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação dos dados enviados")
    })
    @PostMapping
    public ResponseEntity<SolicitacaoResponse> abrirSolicitacao(
            @RequestBody @Valid AbrirSolicitacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacaoService.abrirSolicitacao(request));
    }

    @Operation(
            summary = "Mostrar Detalhes e Orçamento (RF005)",
            description = "Retorna dados completos da solicitação para análise do cliente."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Solicitação encontrada"),
            @ApiResponse(responseCode = "404", description = "Solicitação não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscarPorId(
            @PathVariable Long id,
            @RequestHeader("idUsuarioLogado") Long usuarioIdLogado) {
        return ResponseEntity.ok(solicitacaoService.buscarPorId(id, usuarioIdLogado));
    }

    @Operation(
            summary = "Listar Solicitações por Cliente (RF003)",
            description = "Retorna todas as solicitações do cliente em ordem crescente por data/hora."
    )
    @ApiResponse(responseCode = "200", description = "Listagem retornada com sucesso")
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorCliente(
            @PathVariable Long clienteId,
            @RequestHeader("idUsuarioLogado") Long usuarioIdLogado) {
        return ResponseEntity.ok(solicitacaoService.listarPorCliente(clienteId, usuarioIdLogado));
    }

    @Operation(
            summary = "Listar Solicitações por Funcionário (RF013)",
            description = "Retorna solicitações do funcionário (incluindo redirecionadas quando for o destino)."
    )
    @ApiResponse(responseCode = "200", description = "Listagem retornada com sucesso")
    @GetMapping("/funcionario/{funcionarioId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorFuncionario(
            @PathVariable Long funcionarioId,
            @RequestHeader("idUsuarioLogado") Long usuarioIdLogado) {
        return ResponseEntity.ok(solicitacaoService.listarPorFuncionario(funcionarioId, usuarioIdLogado));
    }

    @Operation(
            summary = "Listar Solicitações Abertas (RF011)",
            description = "Retorna solicitações no estado ABERTA para atendimento inicial de funcionários."
    )
    @ApiResponse(responseCode = "200", description = "Listagem retornada com sucesso")
    @GetMapping("/abertas")
    public ResponseEntity<List<SolicitacaoResponse>> listarAbertas(
            @RequestHeader("idUsuarioLogado") Long usuarioIdLogado) {
        return ResponseEntity.ok(solicitacaoService.listarAbertas(usuarioIdLogado));
    }

    @Operation(
            summary = "Visualizar Histórico do Serviço (RF008)",
            description = "Retorna timeline completa de mudanças de estado da solicitação."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Histórico retornado com sucesso"),
            @ApiResponse(responseCode = "204", description = "Nenhum histórico encontrado"),
            @ApiResponse(responseCode = "404", description = "Solicitação não encontrada")
    })
    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoSolicitacaoResponse>> listarHistorico(
            @PathVariable Long id,
            @RequestHeader("idUsuarioLogado") Long usuarioIdLogado) {
        List<HistoricoSolicitacaoResponse> historico = solicitacaoService.buscarHistorico(id, usuarioIdLogado);
        if (historico.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(historico);
    }

    @Operation(
            summary = "Buscar Último Orçamento (RF005)",
            description = "Retorna a versão mais recente do orçamento da solicitação com seus itens."
    )
    @GetMapping("/{id}/orcamento")
    public ResponseEntity<OrcamentoResponse> buscarUltimoOrcamento(
            @PathVariable Long id,
            @RequestHeader("idUsuarioLogado") Long usuarioIdLogado) {
        return ResponseEntity.ok(solicitacaoService.buscarUltimoOrcamento(id, usuarioIdLogado));
    }

    @Operation(
            summary = "Efetuar Orçamento (RF012)",
            description = "Funcionário registra orçamento da solicitação e altera status para ORÇADA."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Orçamento registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação ou regra de negócio"),
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

    @Operation(
            summary = "Aprovar Serviço (RF006)",
            description = "Cliente aprova o serviço orçado e a solicitação passa para APROVADA."
    )
    @PostMapping("/{id}/aprovar")
    public ResponseEntity<SolicitacaoResponse> aprovarOrcamento(
            @PathVariable Long id,
            @RequestHeader("idUsuarioLogado") Long clienteId) {
        return ResponseEntity.ok(solicitacaoService.aprovarOrcamento(id, clienteId));
    }

    @Operation(
            summary = "Rejeitar Serviço (RF007)",
            description = "Cliente rejeita o serviço orçado com motivo e a solicitação passa para REJEITADA."
    )
    @PostMapping("/{id}/rejeitar")
    public ResponseEntity<SolicitacaoResponse> rejeitarOrcamento(
            @PathVariable Long id,
            @RequestBody @Valid RejeitarOrcamentoRequest request,
            @RequestHeader("idUsuarioLogado") Long clienteId) {
        return ResponseEntity.ok(solicitacaoService.rejeitarOrcamento(id, request, clienteId));
    }

    @Operation(
            summary = "Resgatar Serviço (RF009)",
            description = "Cliente resgata solicitação REJEITADA para APROVADA e registra no histórico."
    )
    @PostMapping("/{id}/resgatar")
    public ResponseEntity<SolicitacaoResponse> resgatarServico(
            @PathVariable Long id,
            @RequestHeader("idUsuarioLogado") Long clienteId) {
        return ResponseEntity.ok(solicitacaoService.resgatarServico(id, clienteId));
    }

    @Operation(
            summary = "Pagar Serviço (RF010)",
            description = "Cliente confirma pagamento de solicitação ARRUMADA, registrando valor e data/hora."
    )
    @PostMapping("/{id}/pagamento")
    public ResponseEntity<SolicitacaoResponse> confirmarPagamento(
            @PathVariable Long id,
            @RequestBody @Valid ConfirmarPagamentoRequest request,
            @RequestHeader("idUsuarioLogado") Long clienteId) {
        return ResponseEntity.ok(solicitacaoService.confirmarPagamento(id, request, clienteId));
    }

    @Operation(
            summary = "Efetuar Manutenção (RF014)",
            description = "Funcionário registra manutenção e altera status para ARRUMADA."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Manutenção registrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação dos dados"),
            @ApiResponse(responseCode = "404", description = "Solicitação ou funcionário não encontrados"),
            @ApiResponse(responseCode = "409", description = "Solicitação fora do estado permitido para manutenção")
    })
    @PostMapping("/{id}/manutencao")
    public ResponseEntity<SolicitacaoResponse> registrarManutencao(
            @PathVariable Long id,
            @RequestBody @Valid RegistrarManutencaoRequest request,
            @RequestHeader("idUsuarioLogado") Long funcionarioId) {
        return ResponseEntity.ok(solicitacaoService.registrarManutencao(id, request, funcionarioId));
    }

    @Operation(
            summary = "Redirecionar Manutenção (RF015)",
            description = "Redireciona solicitação APROVADA para outro técnico, registrando origem/destino no histórico."
    )
    @PostMapping("/{id}/redirecionar")
    public ResponseEntity<SolicitacaoResponse> redirecionarManutencao(
            @PathVariable Long id,
            @RequestBody @Valid RedirecionarManutencaoRequest request,
            @RequestHeader("idUsuarioLogado") Long funcionarioOrigemId) {
        return ResponseEntity.ok(solicitacaoService.redirecionarManutencao(id, request, funcionarioOrigemId));
    }

    @Operation(
            summary = "Finalizar Solicitação (RF016)",
            description = "Finaliza solicitação paga e registra o funcionário responsável."
    )
    @PostMapping("/{id}/finalizar")
    public ResponseEntity<SolicitacaoResponse> finalizarSolicitacao(
            @PathVariable Long id,
            @RequestHeader("idUsuarioLogado") Long funcionarioId) {
        return ResponseEntity.ok(solicitacaoService.finalizarSolicitacao(id, funcionarioId));
    }

    @Operation(
            summary = "Busca Avançada Paginada (Dashboard)",
            description = "Retorna solicitações paginadas com filtros opcionais de status, categoria, funcionário e período."
    )
    @ApiResponse(responseCode = "200", description = "Página retornada com sucesso")
    @GetMapping("/dashboard")
    public ResponseEntity<Page<SolicitacaoResponse>> buscarComFiltrosPaginado(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long funcionarioId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @PageableDefault(size = 10, page = 0, sort = "dataCriacao", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<SolicitacaoResponse> pagina = solicitacaoService.buscarComFiltrosPaginado(
                status, categoriaId, funcionarioId, dataInicio, dataFim, pageable);
        return ResponseEntity.ok(pagina);
    }
}
