package com.senac.ControlaStock.application.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.senac.ControlaStock.application.ports.TokenServicePorts;
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
public class TokenService implements TokenServicePorts {

    @Value("${spring.secretkey}")
    private String secret;

    @Value("${spring.tempo_expiracao}")
    private Long tempo_expiracao;

    private String emissor = "CONTROLASTOCKER";

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
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


    @Override
    @Transactional
    public String validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(emissor)
                    .build();

            var payload = verifier.verify(token);
            String email = payload.getSubject();

            // Verificação validade do token no banco de dados
            var tokenResult = tokenRepository.findByToken(token).orElse(null);
            if (tokenResult == null) {
                return null;
            }

            // O Token é válido e existe. Retorna o email.
            return email;

        } catch (JWTVerificationException e) {
            System.err.println("Erro de validação JWT: " + e.getMessage());
            return null;

        } catch (Exception e) {
            System.err.println("Erro inesperado durante a validação do token: " + e.getMessage());
            return null;
        }
    }

    private Instant gerarDataExpiracao() {
        var dataAtual = LocalDateTime.now();
        dataAtual = dataAtual.plusMinutes(tempo_expiracao);
        return dataAtual.toInstant(ZoneOffset.of("-03:00"));
    }
}