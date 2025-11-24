package com.senac.ControlaStock.presentation;

import com.senac.ControlaStock.application.dto.login.LoginRequestDto;
import com.senac.ControlaStock.application.dto.login.LoginResponseDto;
import com.senac.ControlaStock.application.dto.usuario.UsuarioRequestDto;
import com.senac.ControlaStock.application.dto.usuario.UsuarioResponseDto;
import com.senac.ControlaStock.application.ports.TokenServicePorts;
import com.senac.ControlaStock.application.ports.UsuarioServicePorts;
import com.senac.ControlaStock.domain.entities.Usuario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Endpoints responsáveis pela autenticação e registro de usuários.")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenServicePorts tokenService;

    @Autowired
    private UsuarioServicePorts usuarioService;

    @PostMapping("/login")
    @Operation(summary = "Realiza o login do usuário", description = "Autentica o usuário com email e senha e retorna um token JWT em caso de sucesso.")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto request) {
        try {
            var authenticationToken = new UsernamePasswordAuthenticationToken(request.email(), request.senha());
            Authentication authentication = this.authenticationManager.authenticate(authenticationToken);

            var usuario = (Usuario) authentication.getPrincipal();
            String token = tokenService.gerarToken(usuario);

            var loginResponse = new LoginResponseDto(token);

            return ResponseEntity.ok(loginResponse);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciais inválidas"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao processar login"));
        }
    }

    @PostMapping("/registrar")
    @Operation(summary = "Registra um novo usuário", description = "Cria um novo usuário no sistema e retorna seus dados sem a senha.")
    public ResponseEntity<?> registrar(@Valid @RequestBody UsuarioRequestDto usuarioRequestDto) {
        try {
            System.out.println("AuthController - Recebida requisição de registro para: " + usuarioRequestDto.email());
            UsuarioResponseDto novoUsuario = usuarioService.criarUsuario(usuarioRequestDto);
            System.out.println("AuthController - Usuário criado com sucesso: " + novoUsuario.email());
            return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
        } catch (org.springframework.web.server.ResponseStatusException e) {
            System.err.println("AuthController - Erro ao registrar usuário: " + e.getReason());
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            System.err.println("AuthController - Erro ao registrar usuário: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Erro ao registrar usuário: " + e.getMessage()));
        }
    }
}