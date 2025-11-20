package com.controlastock.controlastockadminconfig.controller;

import com.controlastock.controlastockadminconfig.model.DAO.UsuarioDAO;
import com.controlastock.controlastockadminconfig.model.Usuario;
import com.controlastock.controlastockadminconfig.Utils.JPAUtils;
import jakarta.persistence.EntityManager;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.TextField;


public class UsuarioController {

    @FXML
    private TextField txtNome;
    @FXML
    private TextField txtEmail;
    @FXML
    private TextField txtSenha;
    @FXML
    private TextField txtCnpj;


    public void UsuarioCadastro(ActionEvent event) {
        try {
            EntityManager entityManager = JPAUtils.getEntityManager();
            UsuarioDAO usuarioDAO = new UsuarioDAO(entityManager);

            Usuario usuarioBanco = new Usuario();
            usuarioBanco.setNome(txtNome.getText());
            usuarioBanco.setEmail(txtEmail.getText());
            usuarioBanco.setSenha(txtSenha.getText());
            usuarioBanco.setCnpj(txtCnpj.getText());

            usuarioDAO.salvar(usuarioBanco);

            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle("Sucesso");
            alert.setHeaderText(null);
            alert.setContentText("Administrador cadastrado com sucesso!");
            alert.showAndWait();

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
