package com.controlastock.controlastockadminconfig.controller;

import com.controlastock.controlastockadminconfig.model.DAO.UsuarioDAO;
import com.controlastock.controlastockadminconfig.model.Usuario;
import com.controlastock.controlastockadminconfig.Utils.JPAUtils;
import jakarta.persistence.EntityManager;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.TextField;
import org.mindrot.jbcrypt.BCrypt;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class UsuarioController {

    @FXML
    private TextField txtNome;
    @FXML
    private TextField txtEmail;
    @FXML
    private TextField txtSenha;
    @FXML
    private TextField txtCnpj;
    @FXML
    private TextField txtCep;

    private boolean cepValidado = false;

    public void validarCep(ActionEvent event) {
        try {
            String cep = txtCep.getText().replaceAll("[^0-9]", "");

            if (cep.length() != 8) {
                showError("CEP deve ter 8 dígitos!");
                cepValidado = false;
                return;
            }

            var urlEndereco = "https://viacep.com.br/ws/" + cep + "/json/";
            URL url = new URL(urlEndereco);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-Type", "application/json");

            int status = conn.getResponseCode();
            if (status == 200) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                String jsonResponse = response.toString();

                if (jsonResponse.contains("\"erro\": true")) {
                    showError("CEP não encontrado!");
                    cepValidado = false;
                } else {
                    String enderecoFormatado = formatarEndereco(jsonResponse);
                    showSuccess("CEP válido!", enderecoFormatado);
                    cepValidado = true;
                }
            } else {
                showError("Erro ao consultar CEP!");
                cepValidado = false;
            }
            conn.disconnect();

        } catch (Exception e) {
            showError("Erro ao validar CEP: " + e.getMessage());
            cepValidado = false;
        }
    }

    // ✅ MÉTODO PARA CADASTRAR USUÁRIO (CHAMADO PELO BOTÃO "ENVIAR")
    public void UsuarioCadastro(ActionEvent event) {
        try {
            // Validar campos vazios
            if (txtNome.getText().isEmpty() || txtEmail.getText().isEmpty() ||
                    txtSenha.getText().isEmpty() || txtCnpj.getText().isEmpty() || txtCep.getText().isEmpty()) {
                showError("Preencha todos os campos!");
                return;
            }

            // Verificar se o CEP foi validado
            if (!cepValidado) {
                showError("Por favor, valide o CEP antes de cadastrar!");
                return;
            }

            EntityManager entityManager = JPAUtils.getEntityManager();
            UsuarioDAO usuarioDAO = new UsuarioDAO(entityManager);

            String senhaCriptografada = BCrypt.hashpw(txtSenha.getText(), BCrypt.gensalt());

            Usuario usuarioBanco = new Usuario();
            usuarioBanco.setNome(txtNome.getText());
            usuarioBanco.setEmail(txtEmail.getText());
            usuarioBanco.setSenha(senhaCriptografada);
            usuarioBanco.setCnpj(txtCnpj.getText());
            usuarioBanco.setCep(txtCep.getText());
            usuarioBanco.setRole("ROLE_ADMIN");

            usuarioDAO.salvar(usuarioBanco);

            showSuccess("Sucesso", "Administrador cadastrado com sucesso!\n\nEmail: " + txtEmail.getText());

            // Limpar campos
            txtNome.clear();
            txtEmail.clear();
            txtSenha.clear();
            txtCnpj.clear();
            txtCep.clear();
            cepValidado = false;

        } catch (Exception e) {
            e.printStackTrace();
            showError("Falha ao cadastrar: " + e.getMessage());
        }
    }

    private String formatarEndereco(String json) {
        try {
            String logradouro = extrairValor(json, "logradouro");
            String bairro = extrairValor(json, "bairro");
            String localidade = extrairValor(json, "localidade");
            String uf = extrairValor(json, "uf");
            String cep = extrairValor(json, "cep");

            StringBuilder endereco = new StringBuilder();
            endereco.append("CEP: ").append(cep).append("\n");
            if (!logradouro.isEmpty()) endereco.append("Logradouro: ").append(logradouro).append("\n");
            if (!bairro.isEmpty()) endereco.append("Bairro: ").append(bairro).append("\n");
            endereco.append("Cidade: ").append(localidade).append(" - ").append(uf);

            return endereco.toString();
        } catch (Exception e) {
            return "Endereço encontrado";
        }
    }

    private String extrairValor(String json, String chave) {
        try {
            String busca = "\"" + chave + "\": \"";
            int inicio = json.indexOf(busca);
            if (inicio == -1) return "";
            inicio += busca.length();
            int fim = json.indexOf("\"", inicio);
            if (fim == -1) return "";
            return json.substring(inicio, fim);
        } catch (Exception e) {
            return "";
        }
    }

    private void showError(String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Erro");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private void showSuccess(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}