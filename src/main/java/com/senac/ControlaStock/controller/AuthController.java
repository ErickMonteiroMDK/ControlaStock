package com.senac.ControlaStock.controller;

import com.senac.ControlaStock.dto.LoginRequestDto;
import com.senac.ControlaStock.dto.LoginResponseDto;
import com.senac.ControlaStock.dto.UsuarioRequestDto;
import com.senac.ControlaStock.dto.UsuarioResponseDto;
import com.senac.ControlaStock.model.Usuario;
import com.senac.ControlaStock.services.TokenService;
import com.senac.ControlaStock.services.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
@Tag(name = "Autenticação", description = "Endpoints responsáveis pela autenticação e registro de usuários.")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    @Operation(summary = "Realiza o login do usuário", description = "Autentica o usuário com email e senha e retorna um token JWT em caso de sucesso.")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
        try {
            var authenticationToken = new UsernamePasswordAuthenticationToken(request.email(), request.senha());
            Authentication authentication = this.authenticationManager.authenticate(authenticationToken);

            var usuario = (Usuario) authentication.getPrincipal();
            String token = tokenService.gerarToken(usuario);

            var loginResponse = new LoginResponseDto(token);

            return ResponseEntity.ok(loginResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/registrar")
    @Operation(summary = "Registra um novo usuário", description = "Cria um novo usuário no sistema e retorna seus dados sem a senha.")
    public ResponseEntity<UsuarioResponseDto> registrar(@RequestBody UsuarioRequestDto usuarioRequestDto) {
        UsuarioResponseDto novoUsuario = usuarioService.criarUsuario(usuarioRequestDto);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }
}