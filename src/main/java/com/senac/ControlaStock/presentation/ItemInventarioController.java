package com.senac.ControlaStock.presentation;

import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioRequestDto;
import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioResponseDto;
import com.senac.ControlaStock.application.ports.ItemInventarioServicePorts;
import com.senac.ControlaStock.domain.entities.Usuario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@Tag(name = "Inventário", description = "Endpoints para o gerenciamento de itens no inventário.")
public class ItemInventarioController {

    @Autowired
    private ItemInventarioServicePorts itemInventarioService;

    @GetMapping
    @Operation(summary = "Lista todos os itens do inventário do usuário logado")
    public ResponseEntity<List<ItemInventarioResponseDto>> listarTodos(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        List<ItemInventarioResponseDto> itens = itemInventarioService.listarTodos(usuarioLogado);
        return ResponseEntity.ok(itens);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um item por ID (apenas se pertencer ao usuário logado)")
    public ResponseEntity<ItemInventarioResponseDto> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        ItemInventarioResponseDto item = itemInventarioService.buscarPorId(id, usuarioLogado);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    @Operation(summary = "Adiciona um novo item ao inventário do usuário logado")
    public ResponseEntity<ItemInventarioResponseDto> adicionarItem(
            @RequestBody ItemInventarioRequestDto itemDto,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        ItemInventarioResponseDto novoItem = itemInventarioService.criarItem(itemDto, usuarioLogado);
        return new ResponseEntity<>(novoItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um item do inventário (apenas se pertencer ao usuário logado)")
    public ResponseEntity<ItemInventarioResponseDto> atualizarItem(
            @PathVariable Long id,
            @RequestBody ItemInventarioRequestDto itemDto,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.atualizarItem(id, itemDto, usuarioLogado);
        return ResponseEntity.ok(itemAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um item do inventário (apenas se pertencer ao usuário logado)")
    public ResponseEntity<Void> removerItem(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        itemInventarioService.removerItem(id, usuarioLogado);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/adicionar")
    @Operation(summary = "Adiciona quantidade a um item (apenas se pertencer ao usuário logado)")
    public ResponseEntity<ItemInventarioResponseDto> adicionarQuantidade(
            @PathVariable Long id,
            @RequestParam Integer quantidade,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.adicionarQuantidade(id, quantidade, usuarioLogado);
        return ResponseEntity.ok(itemAtualizado);
    }

    @PutMapping("/{id}/remover")
    @Operation(summary = "Remove quantidade de um item (apenas se pertencer ao usuário logado)")
    public ResponseEntity<ItemInventarioResponseDto> removerQuantidade(
            @PathVariable Long id,
            @RequestParam Integer quantidade,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.removerQuantidade(id, quantidade, usuarioLogado);
        return ResponseEntity.ok(itemAtualizado);
    }
}