package com.senac.ControlaStock.controller;

import com.senac.ControlaStock.model.Usuario;
import com.senac.ControlaStock.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuários", description = "Endpoints para o gerenciamento de usuários do sistema.")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/{id}")
    @Operation(summary = "Busca um usuário por ID", description = "Retorna os detalhes de um usuário específico com base no seu ID.")
    public ResponseEntity<Usuario> consultaPorId(@PathVariable Integer id) { // Alterado para Integer
        var usuario = usuarioRepository.findById(id).orElse(null);

        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(usuario);
    }

    @GetMapping
    @Operation(summary = "Lista todos os usuários", description = "Retorna uma lista com todos os usuários cadastrados no sistema.")
    public ResponseEntity<?> consultaTodos(){
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @PostMapping
    @Operation(summary = "Cadastra um novo usuário", description = "Cria um novo registro de usuário no banco de dados.")
    public ResponseEntity<?> salvaUsuario(@RequestBody Usuario usuario){
        try{
            var usuarioResponse = usuarioRepository.save(usuario);

            // CORREÇÃO: Retornando o usuário salvo, e não o repositório.
            return ResponseEntity.ok(usuarioResponse);
        } catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}