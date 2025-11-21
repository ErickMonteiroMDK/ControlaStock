package com.controlastock.controlastockadminconfig.controller;

import com.controlastock.controlastockadminconfig.model.DAO.UsuarioDAO;
import com.controlastock.controlastockadminconfig.model.Usuario;
import com.controlastock.controlastockadminconfig.Utils.JPAUtils;
import jakarta.persistence.EntityManager;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.TextField;

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
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Erro");
                alert.setHeaderText(null);
                alert.setContentText("CEP deve ter 8 dígitos!");
                alert.showAndWait();
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

                // Verifica se o CEP existe
                if (jsonResponse.contains("\"erro\": true")) {
                    Alert alert = new Alert(Alert.AlertType.ERROR);
                    alert.setTitle("Erro");
                    alert.setHeaderText(null);
                    alert.setContentText("CEP não encontrado!");
                    alert.showAndWait();
                    cepValidado = false;
                } else {
                    Alert alert = new Alert(Alert.AlertType.INFORMATION);
                    alert.setTitle("Sucesso");
                    alert.setHeaderText(null);
                    alert.setContentText("CEP válido!\n\n" + jsonResponse);
                    alert.showAndWait();
                    cepValidado = true;
                }
            }
            conn.disconnect();

        } catch (Exception e) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Erro");
            alert.setHeaderText(null);
            alert.setContentText("Erro ao validar CEP: " + e.getMessage());
            alert.showAndWait();
            cepValidado = false;
        }
    }

    public void UsuarioCadastro(ActionEvent event) {
        try {
            // Validar campos vazios
            if (txtNome.getText().isEmpty() || txtEmail.getText().isEmpty() ||
                    txtSenha.getText().isEmpty() || txtCnpj.getText().isEmpty() || txtCep.getText().isEmpty()) {
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Erro");
                alert.setHeaderText(null);
                alert.setContentText("Preencha todos os campos!");
                alert.showAndWait();
                return;
            }

            EntityManager entityManager = JPAUtils.getEntityManager();
            UsuarioDAO usuarioDAO = new UsuarioDAO(entityManager);

            Usuario usuarioBanco = new Usuario();
            usuarioBanco.setNome(txtNome.getText());
            usuarioBanco.setEmail(txtEmail.getText());
            usuarioBanco.setSenha(txtSenha.getText());
            usuarioBanco.setCnpj(txtCnpj.getText());
            usuarioBanco.setCep(txtCep.getText());

            usuarioDAO.salvar(usuarioBanco);

            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle("Sucesso");
            alert.setHeaderText(null);
            alert.setContentText("Administrador cadastrado com sucesso!");
            alert.showAndWait();

            // Limpar campos
            txtNome.clear();
            txtEmail.clear();
            txtSenha.clear();
            txtCnpj.clear();
            txtCep.clear();
            cepValidado = false;

        } catch (Exception e) {
            e.printStackTrace();
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Erro");
            alert.setHeaderText("Falha ao cadastrar o administrador");
            alert.setContentText(e.getMessage());
            alert.showAndWait();
        }
    }
}