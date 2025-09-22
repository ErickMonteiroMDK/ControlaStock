package com.senac.ControlaStock.controller;

import com.senac.ControlaStock.dto.ItemInventarioRequestDto;
import com.senac.ControlaStock.dto.ItemInventarioResponseDto;
import com.senac.ControlaStock.services.ItemInventarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario") // Padronizando a rota
@Tag(name = "Inventário", description = "Endpoints para o gerenciamento de itens no inventário.")
public class ItemInventarioController {

    @Autowired
    private ItemInventarioService itemInventarioService;

    @GetMapping
    @Operation(summary = "Lista todos os itens do inventário")
    public ResponseEntity<List<ItemInventarioResponseDto>> listarTodos() {
        List<ItemInventarioResponseDto> itens = itemInventarioService.listarTodos();
        return ResponseEntity.ok(itens);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um item por ID")
    public ResponseEntity<ItemInventarioResponseDto> buscarPorId(@PathVariable Long id) {
        ItemInventarioResponseDto item = itemInventarioService.buscarPorId(id);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    @Operation(summary = "Adiciona um novo item ao inventário")
    public ResponseEntity<ItemInventarioResponseDto> adicionarItem(@RequestBody ItemInventarioRequestDto itemDto) {
        ItemInventarioResponseDto novoItem = itemInventarioService.criarItem(itemDto);
        return new ResponseEntity<>(novoItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um item do inventário")
    public ResponseEntity<ItemInventarioResponseDto> atualizarItem(@PathVariable Long id, @RequestBody ItemInventarioRequestDto itemDto) {
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.atualizarItem(id, itemDto);
        return ResponseEntity.ok(itemAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um item do inventário")
    public ResponseEntity<Void> removerItem(@PathVariable Long id) {
        itemInventarioService.removerItem(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/adicionar")
    @Operation(summary = "Adiciona quantidade a um item")
    public ResponseEntity<ItemInventarioResponseDto> adicionarQuantidade(@PathVariable Long id, @RequestParam Integer quantidade) {
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.adicionarQuantidade(id, quantidade);
        return ResponseEntity.ok(itemAtualizado);
    }

    @PutMapping("/{id}/remover")
    @Operation(summary = "Remove quantidade de um item")
    public ResponseEntity<ItemInventarioResponseDto> removerQuantidade(@PathVariable Long id, @RequestParam Integer quantidade) {
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.removerQuantidade(id, quantidade);
        return ResponseEntity.ok(itemAtualizado);
    }
}