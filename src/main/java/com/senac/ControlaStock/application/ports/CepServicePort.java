package com.senac.ControlaStock.application.ports;

import com.senac.ControlaStock.application.dto.endereco.EnderecoDto;

public interface CepServicePort {
    EnderecoDto buscarEnderecoPorCep(String cep); // Agora retorna DTO
}