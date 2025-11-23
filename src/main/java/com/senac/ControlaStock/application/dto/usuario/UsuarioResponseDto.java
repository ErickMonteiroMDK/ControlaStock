package com.senac.ControlaStock.application.dto.usuario;

public record UsuarioResponseDto(
        Long id,
        String nome,
        String cep,
        String cnpj,
        String email,
        String role
) {}