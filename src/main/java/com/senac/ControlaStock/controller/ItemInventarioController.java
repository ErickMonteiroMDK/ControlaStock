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

    @Operation(summary = "Lista todos os itens do inventário", description = "Retorna uma lista completa de todos os itens cadastrados.")
    @GetMapping
    public ResponseEntity<List<ItemInventario>> listarTodos() {
        List<ItemInventario> itens = itemInventarioRepository.findAll();
        return ResponseEntity.ok(itens);
    }

    @Operation(summary = "Busca um item por ID", description = "Retorna os detalhes de um item específico com base no seu ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ItemInventario> buscarPorId(@PathVariable Integer id) {
        return itemInventarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Adiciona um novo item ao inventário", description = "Cria um novo item no inventário. Requer permissão de ADMIN.")
    @PostMapping
    public ResponseEntity<ItemInventario> adicionarItem(@RequestBody ItemInventario item) {
        ItemInventario novoItem = itemInventarioRepository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoItem);
    }
}