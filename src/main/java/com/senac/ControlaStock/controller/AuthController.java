package com.senac.ControlaStock.controller;

import com.senac.ControlaStock.dto.LoginRequestDto;
import com.senac.ControlaStock.model.Usuario;
import com.senac.ControlaStock.services.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Endpoint responsável pela autenticação de usuários e geração de token.")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    @Operation(summary = "Realiza o login do usuário", description = "Autentica o usuário com email e senha e retorna um token JWT em caso de sucesso.")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto request) {
        try {
            var authenticationToken = new UsernamePasswordAuthenticationToken(request.email(), request.senha());
            Authentication authentication = this.authenticationManager.authenticate(authenticationToken);

            var usuario = (Usuario) authentication.getPrincipal();
            String token = tokenService.gerarToken(usuario);

            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Falha na autenticação: " + e.getMessage());
        }
    }
}