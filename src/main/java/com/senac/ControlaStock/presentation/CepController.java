package com.senac.ControlaStock.presentation;

import com.senac.ControlaStock.application.ports.CepServicePort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cep")
public class CepController {

    @Autowired
    private CepServicePort cepService;

    @GetMapping("/{cep}")
    public String buscarCep(@PathVariable String cep) {
        return cepService.buscarEnderecoPorCep(cep);
    }
}
