package com.trabalhow2.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trabalhow2.backend.controller.request.LoginRequest;
import com.trabalhow2.backend.controller.response.LoginResponse;
import com.trabalhow2.backend.model.Usuario;
import com.trabalhow2.backend.service.LoginService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/login")
@Tag(name = "Autenticação", description = "Endpoints para login, logout e controle de sessão dos usuários (RF002)")
public class LoginController {
    
    private final LoginService loginService;

    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @Operation(summary = "Realizar Login (RF002)", description = "Autentica um usuário (Cliente ou Funcionário) no sistema usando e-mail e senha, e cria uma sessão ativa, identificando automaticamente o seu perfil.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login realizado com sucesso. Sessão criada."),
        @ApiResponse(responseCode = "400", description = "Erro de validação (ex: campos vazios)"),
        @ApiResponse(responseCode = "401", description = "Credenciais inválidas (e-mail ou senha incorretos)")
    })

    @PostMapping
    public ResponseEntity<?> fazerLogin(@Valid @RequestBody LoginRequest request, HttpSession session) {

            Usuario usuarioAutenticado = loginService.autenticar(request.getEmail(), request.getSenha());

            session.setAttribute("usuarioId", usuarioAutenticado.getId());
            session.setAttribute("usuarioNome", usuarioAutenticado.getNome());
            session.setAttribute("usuarioPerfil", usuarioAutenticado.getPerfil().name());
            
            LoginResponse response = new LoginResponse(
                usuarioAutenticado.getId(),
                usuarioAutenticado.getNome(),
                usuarioAutenticado.getPerfil().name()
            );
            return ResponseEntity.ok(response);
    }

    @Operation(summary = "Realizar Logout", description = "Encerra a sessão atual do usuário no sistema e invalida o token/cookie.")
    @ApiResponse(responseCode = "200", description = "Logout realizado com sucesso")

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logout realizado com sucesso.");
    }

    @Operation(summary = "Verificar Sessão Ativa", description = "Verifica se existe um usuário autenticado na sessão atual e retorna os seus dados básicos (útil para o F5/Reload da página no Frontend).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Sessão ativa encontrada"),
        @ApiResponse(responseCode = "401", description = "Nenhuma sessão ativa encontrada")
    })

    @GetMapping("/sessao")
    public ResponseEntity<?> verificarSessao(HttpSession session) {
        Object usuarioId = session.getAttribute("usuarioId");

        if (usuarioId == null) {
            return ResponseEntity.status(401).body("Nenhuma sessão ativa.");
        }

        return ResponseEntity.ok(
                new LoginResponse(
                        (Long) session.getAttribute("usuarioId"),
                        (String) session.getAttribute("usuarioNome"),
                        (String) session.getAttribute("usuarioPerfil")
                )
        );
    }
}