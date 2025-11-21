module com.controlastock.controlastockadminconfig {
    requires javafx.controls;
    requires javafx.fxml;


    requires jakarta.persistence;
    requires org.hibernate.orm.core;
    requires static lombok;
    requires spring.security.core;
    requires jakarta.validation;
    requires spring.beans;
    requires spring.context;
    requires spring.web;
    requires spring.tx;
    requires com.auth0.jwt;
    requires io.swagger.v3.oas.annotations;
    requires spring.data.jpa;


    opens com.controlastock.controlastockadminconfig to javafx.fxml;
    opens com.controlastock.controlastockadminconfig.model to org.hibernate.orm.core;

    exports com.controlastock.controlastockadminconfig;
    exports com.controlastock.controlastockadminconfig.controller;
    opens com.controlastock.controlastockadminconfig.controller to javafx.fxml;
}