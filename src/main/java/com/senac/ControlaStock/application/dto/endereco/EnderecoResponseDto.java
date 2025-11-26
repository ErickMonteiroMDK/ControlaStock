package com.senac.ControlaStock.application.dto.endereco;

public record EnderecoResponseDto(
        String cep,
        String logradouro,
        String complemento,
        String bairro,
        String localidade,
        String uf,
        String erro  // Para casos onde o CEP não existe
) {}