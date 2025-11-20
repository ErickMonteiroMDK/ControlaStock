package com.controlastock.controlastockadminconfig.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class MenuController {



    public void sair(){
        System.exit(0);
    }

    public void abrirMenuTesteApiBanco(ActionEvent event) throws  Exception {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/controlastock/controlastockadminconfig/testeapibanco-view.fxml"));
        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setScene(scene);

    }


}
