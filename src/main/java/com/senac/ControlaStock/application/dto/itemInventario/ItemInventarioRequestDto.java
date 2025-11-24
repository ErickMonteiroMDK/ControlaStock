package com.senac.ControlaStock.application.dto.itemInventario;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ItemInventarioRequestDto(
        @NotBlank(message = "Nome é obrigatório")
        String nome,

        String descricao,

        @NotNull(message = "Quantidade é obrigatória")
        @Min(value = 0, message = "Quantidade não pode ser negativa")
        Integer quantidade,

        // Localização é opcional - será "Estoque Principal" se vazio
        String localizacao
) {}