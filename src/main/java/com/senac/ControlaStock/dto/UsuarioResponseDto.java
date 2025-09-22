package com.senac.ControlaStock.dto;

public record UsuarioResponseDto(
        Long id,
        String nome,
        String cpf,
        String email,
        String role
) {
}