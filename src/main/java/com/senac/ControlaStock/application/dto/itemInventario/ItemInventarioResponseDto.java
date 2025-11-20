package com.senac.ControlaStock.application.dto.itemInventario;

public record ItemInventarioResponseDto(
        Long id,
        String nome,
        String descricao,
        Integer quantidade,
        String localizacao
) {
}
