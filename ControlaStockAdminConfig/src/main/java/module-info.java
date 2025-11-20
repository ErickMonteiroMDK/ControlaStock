module com.controlastock.controlastockadminconfig {
    requires javafx.controls;
    requires javafx.fxml;


    requires jakarta.persistence;
    requires org.hibernate.orm.core;
    requires static lombok;
    requires spring.security.core;


    opens com.controlastock.controlastockadminconfig to javafx.fxml;
    opens com.controlastock.controlastockadminconfig.model to org.hibernate.orm.core;

    exports com.controlastock.controlastockadminconfig;
    exports com.controlastock.controlastockadminconfig.controller;
    opens com.controlastock.controlastockadminconfig.controller to javafx.fxml;
}