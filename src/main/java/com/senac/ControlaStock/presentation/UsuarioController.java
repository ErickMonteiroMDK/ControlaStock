package com.senac.ControlaStock.presentation;

import com.senac.ControlaStock.application.dto.usuario.UsuarioRequestDto;
import com.senac.ControlaStock.application.dto.usuario.UsuarioResponseDto;
import com.senac.ControlaStock.application.services.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuários", description = "Endpoints para o gerenciamento de usuários do sistema.")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Lista todos os usuários")
    public ResponseEntity<List<UsuarioResponseDto>> consultaTodos() {
        List<UsuarioResponseDto> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um usuário por ID")
    public ResponseEntity<UsuarioResponseDto> consultaPorId(@PathVariable Long id) {
        UsuarioResponseDto usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping
    @Operation(summary = "Cadastra um novo usuário")
    public ResponseEntity<UsuarioResponseDto> salvaUsuario(@RequestBody UsuarioRequestDto usuarioDto) {
        UsuarioResponseDto usuarioSalvo = usuarioService.criarUsuario(usuarioDto);
        return new ResponseEntity<>(usuarioSalvo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um usuário")
    public ResponseEntity<UsuarioResponseDto> atualizarUsuario(@PathVariable Long id, @RequestBody UsuarioRequestDto usuarioDto) {
        UsuarioResponseDto usuarioAtualizado = usuarioService.atualizarUsuario(id, usuarioDto);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um usuário")
    public ResponseEntity<Void> removerUsuario(@PathVariable Long id) {
        usuarioService.removerUsuario(id);
        return ResponseEntity.noContent().build();
    }

    // 🔹 Perfil do usuário logado
    @GetMapping("/perfil")
    @Operation(summary = "Busca o perfil do usuário logado")
    public ResponseEntity<UsuarioResponseDto> consultarPerfilAtual(Authentication authentication) {
        String email = authentication.getName();
        UsuarioResponseDto usuario = usuarioService.buscarPorEmail(email);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/perfil")
    @Operation(summary = "Atualiza o perfil do usuário logado")
    public ResponseEntity<UsuarioResponseDto> atualizarPerfilAtual(
            @RequestBody UsuarioRequestDto usuarioDto,
            Authentication authentication) {
        String email = authentication.getName();
        UsuarioResponseDto usuarioAtualizado = usuarioService.atualizarPerfilPorEmail(email, usuarioDto);
        return ResponseEntity.ok(usuarioAtualizado);
    }
}
