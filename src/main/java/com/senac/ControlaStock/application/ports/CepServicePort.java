package com.senac.ControlaStock.application.ports;

import com.senac.ControlaStock.application.dto.endereco.EnderecoResponseDto;

public interface CepServicePort {
    EnderecoResponseDto buscarEnderecoPorCep(String cep); // Agora retorna DTO
}