package com.senac.ControlaStock.presentation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "ControlaStock API está funcionando! Acesse /swagger-ui.html para ver a documentação da API.";
    }

    @GetMapping("/health")
    public String health() {
        return "API está online e funcionando perfeitamente!";
    }
}