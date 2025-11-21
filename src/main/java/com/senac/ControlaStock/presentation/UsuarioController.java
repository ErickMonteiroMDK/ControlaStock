package com.senac.ControlaStock.presentation;

import com.senac.ControlaStock.application.dto.usuario.UsuarioRequestDto;
import com.senac.ControlaStock.application.dto.usuario.UsuarioResponseDto;
import com.senac.ControlaStock.application.services.UsuarioService;
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
    private UsuarioService usuarioService;

    // Usuários comuns nao poden listar todos os usuários
    // @GetMapping
    // @Operation(summary = "Lista todos os usuários")
    // public ResponseEntity<List<UsuarioResponseDto>> consultaTodos() {
    //     List<UsuarioResponseDto> usuarios = usuarioService.listarTodos();
    //     return ResponseEntity.ok(usuarios);
    // }

    // Um usuário nao deve buscar outros usuários por ID
    // @GetMapping("/{id}")
    // @Operation(summary = "Busca um usuário por ID")
    // public ResponseEntity<UsuarioResponseDto> consultaPorId(@PathVariable Long id) {
    //     UsuarioResponseDto usuario = usuarioService.buscarPorId(id);
    //     return ResponseEntity.ok(usuario);
    // }

    //  Usei o /auth/registrar
    // @PostMapping
    // @Operation(summary = "Cadastra um novo usuário")
    // public ResponseEntity<UsuarioResponseDto> salvaUsuario(@RequestBody UsuarioRequestDto usuarioDto) {
    //     UsuarioResponseDto usuarioSalvo = usuarioService.criarUsuario(usuarioDto);
    //     return new ResponseEntity<>(usuarioSalvo, HttpStatus.CREATED);
    // }

    //Usuário só pode atualizar a si mesmo
    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um usuário (apenas o próprio usuário ou admin)")
    public ResponseEntity<UsuarioResponseDto> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody UsuarioRequestDto usuarioDto,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        // Verificar se o usuário está tentando atualizar a si mesmo
        if (!usuarioLogado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        UsuarioResponseDto usuarioAtualizado = usuarioService.atualizarUsuario(id, usuarioDto);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    //  Usuário só pode deletar a si mesmo
    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um usuário (apenas o próprio usuário)")
    public ResponseEntity<Void> removerUsuario(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        // Verificar se o usuário está tentando deletar a si mesmo
        if (!usuarioLogado.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        usuarioService.removerUsuario(id);
        return ResponseEntity.noContent().build();
    }

    //  Perfil do usuário logado
    @GetMapping("/perfil")
    @Operation(summary = "Busca o perfil do usuário logado")
    public ResponseEntity<UsuarioResponseDto> consultarPerfilAtual(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        UsuarioResponseDto usuario = usuarioService.buscarPorEmail(usuarioLogado.getEmail());
        return ResponseEntity.ok(usuario);
    }

    //  Atualizar perfil do usuário logado
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