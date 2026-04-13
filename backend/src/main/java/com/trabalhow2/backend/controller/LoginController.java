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

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/login")
public class LoginController {
    
    private final LoginService loginService;

    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

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

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logout realizado com sucesso.");
    }

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