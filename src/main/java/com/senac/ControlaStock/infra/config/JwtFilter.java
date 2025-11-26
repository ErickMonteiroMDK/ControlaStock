package com.senac.ControlaStock.infra.config;

import com.senac.ControlaStock.application.services.TokenService;
//import com.senac.ControlaStock.domain.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // NOVO
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    TokenService tokenService;

    @Autowired
    UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverToken(request);

        //  Verifica se já existe autenticação
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            // Se já está autenticado, apenas continua
            filterChain.doFilter(request, response);
            return;
        }

        if (token != null) {
            String login = tokenService.validarToken(token);

            if (login != null && !login.isEmpty()) {

                try {
                    // carrega o objeto Usuario usando o serviço padrão
                    UserDetails usuario = userDetailsService.loadUserByUsername(login);

                    if (usuario != null) {
                        System.out.println(" JWT Filter: Usuário encontrado: " + usuario.getUsername());
                        System.out.println(" JWT Filter: Authorities carregadas: " + usuario.getAuthorities());

                        // Configura o objeto de autenticação com  UserDetail
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                usuario,
                                null, // Senha é nula pois já autenticamos via token
                                usuario.getAuthorities()
                        );

                        // Injeta o contexto de segurança
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } catch (Exception e) {
                    System.err.println(" Erro ao carregar UserDetails no JWT Filter para: " + login + ". Erro: " + e.getMessage());
                }
            }
        }

        // Continua a cadeia de filtros
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request){
        var authHeader = request.getHeader("Authorization");
        if(authHeader == null) return null;
        return authHeader.replace("Bearer ","").trim();
    }
}