package com.senac.ControlaStock.application.ports;

import com.senac.ControlaStock.domain.entities.Usuario;

public interface TokenServicePorts {

    // Método para gerar o token
    String gerarToken(Usuario usuario);

    // Método para validar o token e retornar o login (email) do Subject como String
    String validarToken(String token);
}