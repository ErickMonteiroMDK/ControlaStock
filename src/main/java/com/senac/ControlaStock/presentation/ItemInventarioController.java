package com.senac.ControlaStock.presentation;

import com.senac.ControlaStock.application.ports.ItemInventarioServicePorts;
import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioRequestDto;
import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioResponseDto;
import com.senac.ControlaStock.domain.entities.Usuario;
import com.senac.ControlaStock.domain.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@Tag(name = "Inventário", description = "Endpoints para o gerenciamento de itens no inventário.")
public class ItemInventarioController {

    @Autowired
    private ItemInventarioServicePorts itemInventarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * 🔧 MODO DESENVOLVIMENTO: Busca o usuário pelo email enviado no header
     * Header: X-User-Email: usuario@email.com
     */
    private Usuario getUsuarioPorEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Header 'X-User-Email' é obrigatório. Envie o email do usuário logado."
            );
        }

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário com email '" + email + "' não encontrado."
                ));
    }

    @GetMapping
    @Operation(summary = "Lista todos os itens do inventário do usuário")
    public ResponseEntity<List<ItemInventarioResponseDto>> listarTodos(
            @Parameter(description = "Email do usuário logado", required = true)
            @RequestHeader("X-User-Email") String userEmail) {

        Usuario usuario = getUsuarioPorEmail(userEmail);
        List<ItemInventarioResponseDto> itens = itemInventarioService.listarTodos(usuario);
        return ResponseEntity.ok(itens);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um item por ID")
    public ResponseEntity<ItemInventarioResponseDto> buscarPorId(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String userEmail) {

        Usuario usuario = getUsuarioPorEmail(userEmail);
        ItemInventarioResponseDto item = itemInventarioService.buscarPorId(id, usuario);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    @Operation(summary = "Adiciona um novo item ao inventário")
    public ResponseEntity<ItemInventarioResponseDto> adicionarItem(
            @RequestBody ItemInventarioRequestDto itemDto,
            @RequestHeader("X-User-Email") String userEmail) {

        Usuario usuario = getUsuarioPorEmail(userEmail);
        ItemInventarioResponseDto novoItem = itemInventarioService.criarItem(itemDto, usuario);
        return new ResponseEntity<>(novoItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um item do inventário")
    public ResponseEntity<ItemInventarioResponseDto> atualizarItem(
            @PathVariable Long id,
            @RequestBody ItemInventarioRequestDto itemDto,
            @RequestHeader("X-User-Email") String userEmail) {

        Usuario usuario = getUsuarioPorEmail(userEmail);
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.atualizarItem(id, itemDto, usuario);
        return ResponseEntity.ok(itemAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um item do inventário")
    public ResponseEntity<Void> removerItem(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String userEmail) {

        Usuario usuario = getUsuarioPorEmail(userEmail);
        itemInventarioService.removerItem(id, usuario);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/adicionar")
    @Operation(summary = "Adiciona quantidade a um item")
    public ResponseEntity<ItemInventarioResponseDto> adicionarQuantidade(
            @PathVariable Long id,
            @RequestParam Integer quantidade,
            @RequestHeader("X-User-Email") String userEmail) {

        Usuario usuario = getUsuarioPorEmail(userEmail);
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.adicionarQuantidade(id, quantidade, usuario);
        return ResponseEntity.ok(itemAtualizado);
    }

    @PutMapping("/{id}/remover")
    @Operation(summary = "Remove quantidade de um item")
    public ResponseEntity<ItemInventarioResponseDto> removerQuantidade(
            @PathVariable Long id,
            @RequestParam Integer quantidade,
            @RequestHeader("X-User-Email") String userEmail) {

        Usuario usuario = getUsuarioPorEmail(userEmail);
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.removerQuantidade(id, quantidade, usuario);
        return ResponseEntity.ok(itemAtualizado);
    }
}