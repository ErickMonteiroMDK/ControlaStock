package com.senac.ControlaStock.presentation;

import com.senac.ControlaStock.application.ports.ItemInventarioServicePorts;
import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioRequestDto;
import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioResponseDto;
import com.senac.ControlaStock.domain.entities.Usuario;
import com.senac.ControlaStock.domain.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@Tag(name = "Inventário", description = "Endpoints para o gerenciamento de itens no inventário.")
public class ItemInventarioController {

    @Autowired
    private ItemInventarioServicePorts itemInventarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Pega o primeiro usuário do banco (TEMPORÁRIO)
    private Usuario getUsuarioTemporario() {
        return usuarioRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Nenhum usuário encontrado no banco. Crie um usuário primeiro!"));
    }

    @GetMapping
    @Operation(summary = "Lista todos os itens do inventário")
    public ResponseEntity<List<ItemInventarioResponseDto>> listarTodos() {
        Usuario usuario = getUsuarioTemporario();
        List<ItemInventarioResponseDto> itens = itemInventarioService.listarTodos(usuario);
        return ResponseEntity.ok(itens);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um item por ID")
    public ResponseEntity<ItemInventarioResponseDto> buscarPorId(@PathVariable Long id) {
        Usuario usuario = getUsuarioTemporario();
        ItemInventarioResponseDto item = itemInventarioService.buscarPorId(id, usuario);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    @Operation(summary = "Adiciona um novo item ao inventário")
    public ResponseEntity<ItemInventarioResponseDto> adicionarItem(@RequestBody ItemInventarioRequestDto itemDto) {
        Usuario usuario = getUsuarioTemporario();
        ItemInventarioResponseDto novoItem = itemInventarioService.criarItem(itemDto, usuario);
        return new ResponseEntity<>(novoItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um item do inventário")
    public ResponseEntity<ItemInventarioResponseDto> atualizarItem(
            @PathVariable Long id,
            @RequestBody ItemInventarioRequestDto itemDto) {
        Usuario usuario = getUsuarioTemporario();
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.atualizarItem(id, itemDto, usuario);
        return ResponseEntity.ok(itemAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um item do inventário")
    public ResponseEntity<Void> removerItem(@PathVariable Long id) {
        Usuario usuario = getUsuarioTemporario();
        itemInventarioService.removerItem(id, usuario);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/adicionar")
    @Operation(summary = "Adiciona quantidade a um item")
    public ResponseEntity<ItemInventarioResponseDto> adicionarQuantidade(
            @PathVariable Long id,
            @RequestParam Integer quantidade) {
        Usuario usuario = getUsuarioTemporario();
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.adicionarQuantidade(id, quantidade, usuario);
        return ResponseEntity.ok(itemAtualizado);
    }

    @PutMapping("/{id}/remover")
    @Operation(summary = "Remove quantidade de um item")
    public ResponseEntity<ItemInventarioResponseDto> removerQuantidade(
            @PathVariable Long id,
            @RequestParam Integer quantidade) {
        Usuario usuario = getUsuarioTemporario();
        ItemInventarioResponseDto itemAtualizado = itemInventarioService.removerQuantidade(id, quantidade, usuario);
        return ResponseEntity.ok(itemAtualizado);
    }
}