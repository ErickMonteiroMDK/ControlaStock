package com.senac.ControlaStock.application.dto.login;

public record LoginResponseDto(
        String token,
        String tipo,
        Long expiresIn
) {
    public LoginResponseDto(String token) {
        this(token, "Bearer", 3600L);
    }
}