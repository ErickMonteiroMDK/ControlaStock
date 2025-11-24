package com.senac.ControlaStock.application.services;

import com.senac.ControlaStock.application.dto.usuario.UsuarioRequestDto;
import com.senac.ControlaStock.application.dto.usuario.UsuarioResponseDto;
import com.senac.ControlaStock.application.ports.UsuarioServicePorts;
import com.senac.ControlaStock.domain.entities.Usuario;
import com.senac.ControlaStock.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService implements UsuarioServicePorts {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<UsuarioResponseDto> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponseDto buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário com ID " + id + " não encontrado."));
        return toResponseDto(usuario);
    }

    @Override
    public UsuarioResponseDto criarUsuario(UsuarioRequestDto requestDto) {
        if (usuarioRepository.findByEmail(requestDto.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O e-mail informado já está em uso.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(requestDto.nome());
        novoUsuario.setCnpj(requestDto.cnpj());
        novoUsuario.setCep(requestDto.cep());
        novoUsuario.setEmail(requestDto.email());
        novoUsuario.setSenha(passwordEncoder.encode(requestDto.senha()));
        novoUsuario.setRole("ROLE_USER");

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);
        return toResponseDto(usuarioSalvo);
    }

    @Override
    public UsuarioResponseDto atualizarUsuario(Long id, UsuarioRequestDto requestDto) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário com ID " + id + " não encontrado para atualização."));

        usuarioExistente.setNome(requestDto.nome());
        usuarioExistente.setCnpj(requestDto.cnpj());
        usuarioExistente.setCep(requestDto.cep());
        usuarioExistente.setEmail(requestDto.email());

        if (requestDto.senha() != null && !requestDto.senha().isEmpty()) {
            usuarioExistente.setSenha(passwordEncoder.encode(requestDto.senha()));
        }

        Usuario usuarioAtualizado = usuarioRepository.save(usuarioExistente);
        return toResponseDto(usuarioAtualizado);
    }

    @Override
    public void removerUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário com ID " + id + " não encontrado para remoção.");
        }
        usuarioRepository.deleteById(id);
    }

    @Override
    public UsuarioResponseDto buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário com email " + email + " não encontrado."));
        return toResponseDto(usuario);
    }

    @Override
    public UsuarioResponseDto atualizarPerfilPorEmail(String email, UsuarioRequestDto requestDto) {
        Usuario usuarioExistente = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário com email " + email + " não encontrado."));

        if (requestDto.nome() != null && !requestDto.nome().trim().isEmpty()) {
            usuarioExistente.setNome(requestDto.nome());
        }

        if (requestDto.email() != null && !requestDto.email().trim().isEmpty()) {
            if (!requestDto.email().equals(email) && usuarioRepository.findByEmail(requestDto.email()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O e-mail informado já está em uso por outro usuário.");
            }
            usuarioExistente.setEmail(requestDto.email());
        }

        if (requestDto.cnpj() != null && !requestDto.cnpj().trim().isEmpty()) {
            usuarioExistente.setCnpj(requestDto.cnpj());
        }

        if (requestDto.cep() != null && !requestDto.cep().trim().isEmpty()) {
            usuarioExistente.setCep(requestDto.cep());
        }

        if (requestDto.senha() != null && !requestDto.senha().trim().isEmpty()) {
            usuarioExistente.setSenha(passwordEncoder.encode(requestDto.senha()));
        }

        Usuario usuarioAtualizado = usuarioRepository.save(usuarioExistente);
        return toResponseDto(usuarioAtualizado);
    }

    private UsuarioResponseDto toResponseDto(Usuario entity) {
        return new UsuarioResponseDto(
                entity.getId(),
                entity.getNome(),
                entity.getCnpj(),
                entity.getCep(),
                entity.getEmail(),
                entity.getRole()
        );
    }
}