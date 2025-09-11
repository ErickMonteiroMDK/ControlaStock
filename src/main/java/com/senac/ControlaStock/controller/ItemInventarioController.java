package com.senac.ControlaStock.controller;

import com.senac.ControlaStock.model.ItemInventario;
import com.senac.ControlaStock.repository.ItemInventarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventario")
@Tag(name = "Inventário", description = "Endpoints para o gerenciamento de itens no inventário.")
public class ItemInventarioController {

    @Autowired
    private ItemInventarioRepository itemInventarioRepository;

    @GetMapping
    @Operation(summary = "Lista todos os itens do inventário", description = "Retorna uma lista completa de todos os itens cadastrados.")
    public ResponseEntity<List<ItemInventario>> listarTodos() {
        List<ItemInventario> itens = itemInventarioRepository.findAll();
        return ResponseEntity.ok(itens);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um item por ID", description = "Retorna os detalhes de um item específico com base no seu ID.")
    public ResponseEntity<ItemInventario> buscarPorId(@PathVariable Integer id) {
        return itemInventarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Adiciona um novo item ao inventário", description = "Cria um novo item no inventário. Requer permissão de ADMIN.")
    public ResponseEntity<ItemInventario> adicionarItem(@RequestBody ItemInventario item) {
        try {
            ItemInventario novoItem = itemInventarioRepository.save(item);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um item do inventário", description = "Atualiza as informações de um item existente.")
    public ResponseEntity<ItemInventario> atualizarItem(@PathVariable Integer id, @RequestBody ItemInventario item) {
        return itemInventarioRepository.findById(id)
                .map(itemExistente -> {
                    item.setId(id);
                    return ResponseEntity.ok(itemInventarioRepository.save(item));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um item do inventário", description = "Remove um item específico do inventário.")
    public ResponseEntity<Void> removerItem(@PathVariable Integer id) {
        if (itemInventarioRepository.existsById(id)) {
            itemInventarioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}