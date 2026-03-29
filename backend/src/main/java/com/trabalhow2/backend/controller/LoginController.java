package com.trabalhow2.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trabalhow2.backend.controller.request.LoginRequest;
import com.trabalhow2.backend.controller.response.LoginResponse;
import com.trabalhow2.backend.model.Usuario;
import com.trabalhow2.backend.service.LoginService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/login")
public class LoginController {
    
    private final LoginService loginService;

    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping
    public ResponseEntity<?> fazerLogin(@Valid @RequestBody LoginRequest request) {
        try {
            Usuario usuarioAutenticado = loginService.autenticar(request.getEmail(), request.getSenha());
            
            LoginResponse response = new LoginResponse(
                usuarioAutenticado.getNome(),
                usuarioAutenticado.getPerfil().name()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}