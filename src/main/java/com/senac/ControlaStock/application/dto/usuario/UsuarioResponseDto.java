package com.senac.ControlaStock.application.dto.usuario;

public record UsuarioResponseDto(
        Long id,
        String nome,
        String cpf,
        String email,
        String role
) {
}
