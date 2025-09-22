package com.senac.ControlaStock.dto;

public record UsuarioRequestDto(
        String nome,
        String cpf,
        String email,
        String senha
) {
}