package com.senac.ControlaStock.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.senac.ControlaStock.dto.LoginRequestDto;
import com.senac.ControlaStock.model.Token;
import com.senac.ControlaStock.model.Usuario;
import com.senac.ControlaStock.repository.TokenRepository;
import com.senac.ControlaStock.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${spring.secretkey}")
    private String secret;

    @Value("${spring.tempo_expiracao}")
    private Long tempo_expiracao;

    private String emissor = "CONTROLASTOCKER";

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public String gerarToken(LoginRequestDto) {
        var usuario = usuarioRepository.findByEmail(LoginRequestDto.email())
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));

        Algorithm algorithm = Algorithm.HMAC256(secret);

        String token = JWT.create()
                .withIssuer(emissor)
                .withSubject(usuario.getEmail())
                .withExpiresAt(this.gerarDataExpiracao())
                .sign(algorithm);

        tokenRepository.save(new Token(null, token, usuario));
        return token;
    }

    public Usuario validarToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer(emissor)
                .build();

        verifier.verify(token);

        var tokenResult = tokenRepository.findByToken(token).orElse(null);

        if (tokenResult == null) {
            throw new IllegalArgumentException("Token inválido");
        }

        return tokenResult.getUsuario();
    }

    private Instant gerarDataExpiracao() {
        var dataAtual = LocalDateTime.now();
        dataAtual = dataAtual.plusMinutes(tempo_expiracao);
        return dataAtual.toInstant(ZoneOffset.of("-03:00"));
    }
}