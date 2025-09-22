package com.senac.ControlaStock.dto;

public record ItemInventarioRequestDto(
        String nome,
        String descricao,
        Integer quantidade,
        String localizacao
) {
}
