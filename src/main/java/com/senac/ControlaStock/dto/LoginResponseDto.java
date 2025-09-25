package com.senac.ControlaStock.dto;

public record LoginResponseDto(
        String token,
        String tipo,
        Long expiresIn
) {
    public LoginResponseDto(String token) {
        this(token, "Bearer", 3600L);
    }
}