package com.senac.ControlaStock.controller;

import com.senac.ControlaStock.model.Usuario;
import com.senac.ControlaStock.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuários", description = "Endpoints para o gerenciamento de usuários do sistema.")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    @Operation(summary = "Lista todos os usuários", description = "Retorna uma lista com todos os usuários cadastrados no sistema.")
    public ResponseEntity<List<Usuario>> consultaTodos() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um usuário por ID", description = "Retorna os detalhes de um usuário específico com base no seu ID.")
    public ResponseEntity<Usuario> consultaPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Cadastra um novo usuário", description = "Cria um novo registro de usuário no banco de dados.")
    public ResponseEntity<Usuario> salvaUsuario(@RequestBody Usuario usuario) {
        try {
            // Criptografa a senha antes de salvar
            usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

            Usuario usuarioSalvo = usuarioRepository.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um usuário", description = "Atualiza as informações de um usuário existente.")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        Integer idInteger = id.intValue();
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    // Se a senha foi alterada, criptografa novamente
                    if (!usuario.getSenha().equals(usuarioExistente.getSenha())) {
                        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
                    }
                    usuario.setId(id); // setId usa Long, mantemos Long
                    return ResponseEntity.ok(usuarioRepository.save(usuario));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um usuário", description = "Remove um usuário específico do sistema.")
    public ResponseEntity<Void> removerUsuario(@PathVariable Long id) {
        // Conversão de Long para Integer para compatibilidade com o repository
        Integer idInteger = id.intValue();
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}