package com.senac.ControlaStock.presentation;

import com.senac.ControlaStock.application.dto.endereco.EnderecoResponseDto;
import com.senac.ControlaStock.application.ports.CepServicePort;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cep")
@Tag(name = "CEP", description = "Consulta de endereço por CEP")
public class CepController {

    @Autowired
    private CepServicePort cepService;

    @GetMapping("/{cep}")
    @Operation(summary = "Busca endereço pelo CEP")
    public ResponseEntity<EnderecoResponseDto> buscarCep(@PathVariable String cep) {
        try {
            EnderecoResponseDto endereco = cepService.buscarEnderecoPorCep(cep);
            return ResponseEntity.ok(endereco);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}