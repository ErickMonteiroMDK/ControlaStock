package com.senac.ControlaStock.application.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.senac.ControlaStock.domain.entities.Token;
import com.senac.ControlaStock.domain.entities.Usuario;
import com.senac.ControlaStock.domain.repository.TokenRepository;
import com.senac.ControlaStock.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public String gerarToken(Usuario usuario) {
        Algorithm algorithm = Algorithm.HMAC256(secret);

        String token = JWT.create()
                .withIssuer(emissor)
                .withSubject(usuario.getEmail())
                .withExpiresAt(this.gerarDataExpiracao())
                .sign(algorithm);

        tokenRepository.save(new Token(null, token, usuario));
        return token;
    }

    @Transactional // Adicionar transação para evitar problemas de sessão
    public Usuario validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(emissor)
                    .build();

            var payload = verifier.verify(token);
            String email = payload.getSubject(); // Extrair email do token

            // CORREÇÃO: Buscar usuário diretamente pelo email em vez de usar a relação lazy
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

            // Verificar se token existe no banco (opcional - para maior segurança)
            var tokenResult = tokenRepository.findByToken(token).orElse(null);
            if (tokenResult == null) {
                throw new IllegalArgumentException("Token inválido");
            }

            return usuario;

        } catch (JWTVerificationException e) {
            throw new IllegalArgumentException("Token inválido ou expirado: " + e.getMessage());
        }
    }

    private Instant gerarDataExpiracao() {
        var dataAtual = LocalDateTime.now();
        dataAtual = dataAtual.plusMinutes(tempo_expiracao);
        return dataAtual.toInstant(ZoneOffset.of("-03:00"));
    }
}