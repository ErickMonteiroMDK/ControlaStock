package com.senac.ControlaStock.infra.external;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.senac.ControlaStock.application.dto.endereco.EnderecoDto;
import com.senac.ControlaStock.application.ports.CepServicePort;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class ViaCepService implements CepServicePort {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public EnderecoDto buscarEnderecoPorCep(String cep) {
        try {
            String cepLimpo = cep.replaceAll("[^0-9]", "");

            if (cepLimpo.length() != 8) {
                throw new IllegalArgumentException("CEP deve ter 8 dígitos");
            }

            String urlEndereco = "https://viacep.com.br/ws/" + cepLimpo + "/json/";
            URL url = new URL(urlEndereco);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
            );

            StringBuilder response = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                response.append(line);
            }

            in.close();
            conn.disconnect();

            EnderecoDto endereco = objectMapper.readValue(
                    response.toString(),
                    EnderecoDto.class
            );

            if (endereco.erro() != null) {
                throw new RuntimeException("CEP não encontrado");
            }

            return endereco;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao consultar CEP: " + e.getMessage());
        }
    }
}