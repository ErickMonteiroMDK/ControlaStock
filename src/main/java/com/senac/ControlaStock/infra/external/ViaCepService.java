package com.senac.ControlaStock.infra.external;

import com.senac.ControlaStock.application.ports.CepServicePort;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class ViaCepService implements CepServicePort {

    @Override
    public String buscarEnderecoPorCep(String cep) {
        try {
            String urlEndereco = "https://viacep.com.br/ws/" + cep + "/json/";
            URL url = new URL(urlEndereco);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
            );

            String line;
            StringBuilder response = new StringBuilder();
            while ((line = in.readLine()) != null) {
                response.append(line);
            }

            in.close();
            conn.disconnect();

            return response.toString();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao consultar CEP");
        }
    }
}
