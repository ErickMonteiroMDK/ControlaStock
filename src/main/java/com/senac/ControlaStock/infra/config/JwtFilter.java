package com.senac.ControlaStock.infra.config;

import com.senac.ControlaStock.domain.entities.Usuario;
import com.senac.ControlaStock.application.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("JwtFilter - Path: " + path + ", Method: " + method); // LOG para debug

        // Permitir todas as requisições OPTIONS (preflight CORS)
        if ("OPTIONS".equals(method)) {
            System.out.println("JwtFilter - Permitindo OPTIONS request");
            filterChain.doFilter(request, response);
            return;
        }

        // Rotas que não precisam de autenticação
        if (path.equals("/")
                || path.equals("/health")
                || path.startsWith("/auth/") // Permite /auth/login e /auth/registrar
                || path.startsWith("/swagger-ui/")
                || path.equals("/swagger-ui.html")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/webjars/")
                // BACKUP: Permitir POST para registro de usuários (caso ainda use)
                || (path.equals("/api/usuarios") && "POST".equals(method))) {
            System.out.println("JwtFilter - Rota pública, permitindo acesso: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("JwtFilter - Verificando token para rota protegida: " + path);

        try {
            String header = request.getHeader("Authorization");

            if (header != null && header.startsWith("Bearer ")) {
                String token = header.replace("Bearer ", "");
                Usuario usuario = tokenService.validarToken(token);

                var autorizacao = new UsernamePasswordAuthenticationToken(
                        usuario,
                        null,
                        usuario.getAuthorities()
                );

                SecurityContextHolder.getContext().setAuthentication(autorizacao);
                filterChain.doFilter(request, response);

            } else {
                System.out.println("JwtFilter - Token não informado");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"error\": \"Token não informado\"}");
            }

        } catch (Exception e) {
            System.out.println("JwtFilter - Erro ao validar token: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"error\": \"Token inválido ou expirado: " + e.getMessage() + "\"}");
        }
    }
}