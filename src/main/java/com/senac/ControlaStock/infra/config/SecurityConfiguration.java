package com.senac.ControlaStock.infra.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    // Esta é a configuração padrão - COM segurança
    public SecurityFilterChain secureFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource)) // Usar CORS configurado
                .csrf(csrf -> csrf.disable()) // Desabilitar CSRF completamente
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Rotas Públicas - ORDEM IMPORTA!
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Permitir preflight OPTIONS
                        .requestMatchers("/auth/**").permitAll() // Permite login E registro
                        .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll() // Backup se ainda usar createUser
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/",
                                "/health"
                        ).permitAll()
                        // Todas as outras rotas precisam de autenticação
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // CONFIGURAÇÃO SEM SEGURANÇA (PARA DEMONSTRAÇÃO)
    // Descomente o @Bean abaixo e comente o @Primary acima para DESABILITAR a segurança
    // @Bean
    // public SecurityFilterChain openFilterChain(HttpSecurity http) throws Exception {
    //     System.out.println(" ATENÇÃO: SEGURANÇA DESABILITADA - TODOS OS ENDPOINTS ESTÃO ABERTOS!");
    //     return http
    //             .cors(cors -> cors.configurationSource(corsConfigurationSource))
    //             .csrf(csrf -> csrf.disable())
    //             .authorizeHttpRequests(auth -> auth
    //                     .anyRequest().permitAll()     //             )
    //             .build();
    // }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}