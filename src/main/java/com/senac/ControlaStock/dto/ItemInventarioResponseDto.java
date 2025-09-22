package com.senac.ControlaStock.dto;

public record ItemInventarioResponseDto(
        Long id,
        String nome,
        String descricao,
        Integer quantidade,
        String localizacao
) {
}
