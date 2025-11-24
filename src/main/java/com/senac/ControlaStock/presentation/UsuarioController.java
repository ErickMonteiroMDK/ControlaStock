package com.senac.ControlaStock.presentation;

import com.senac.ControlaStock.application.dto.usuario.UsuarioRequestDto;
import com.senac.ControlaStock.application.dto.usuario.UsuarioResponseDto;
import com.senac.ControlaStock.application.ports.UsuarioServicePorts;
import com.senac.ControlaStock.domain.entities.Usuario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuários", description = "Endpoints para o gerenciamento de usuários do sistema.")
public class UsuarioController {

    @Autowired
    private UsuarioServicePorts usuarioService;

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um usuário (apenas o próprio usuário)")
    public ResponseEntity<UsuarioResponseDto> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody UsuarioRequestDto usuarioDto,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        if (!usuarioLogado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        UsuarioResponseDto usuarioAtualizado = usuarioService.atualizarUsuario(id, usuarioDto);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um usuário (apenas o próprio usuário)")
    public ResponseEntity<Void> removerUsuario(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        if (!usuarioLogado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        usuarioService.removerUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/perfil")
    @Operation(summary = "Busca o perfil do usuário logado")
    public ResponseEntity<UsuarioResponseDto> consultarPerfilAtual(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        UsuarioResponseDto usuario = usuarioService.buscarPorEmail(usuarioLogado.getEmail());
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/perfil")
    @Operation(summary = "Atualiza o perfil do usuário logado")
    public ResponseEntity<UsuarioResponseDto> atualizarPerfilAtual(
            @RequestBody UsuarioRequestDto usuarioDto,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        UsuarioResponseDto usuarioAtualizado = usuarioService.atualizarPerfilPorEmail(
                usuarioLogado.getEmail(),
                usuarioDto
        );
        return ResponseEntity.ok(usuarioAtualizado);
    }
}