package com.senac.ControlaStock.application.ports;

import com.senac.ControlaStock.application.dto.usuario.UsuarioRequestDto;
import com.senac.ControlaStock.application.dto.usuario.UsuarioResponseDto;

import java.util.List;

public interface UsuarioServicePorts {
    List<UsuarioResponseDto> listarTodos();
    UsuarioResponseDto buscarPorId(Long id);
    UsuarioResponseDto buscarPorEmail(String email);
    UsuarioResponseDto criarUsuario(UsuarioRequestDto requestDto);
    UsuarioResponseDto atualizarUsuario(Long id, UsuarioRequestDto requestDto);
    UsuarioResponseDto atualizarPerfilPorEmail(String email, UsuarioRequestDto requestDto);
    void removerUsuario(Long id);
}
