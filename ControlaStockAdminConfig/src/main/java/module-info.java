module com.controlastock.controlastockadminconfig {
    requires javafx.controls;
    requires javafx.fxml;
    requires jakarta.persistence;
    requires org.hibernate.orm.core;
    requires java.sql;
    requires java.naming;
    requires jbcrypt;

    opens com.controlastock.controlastockadminconfig to javafx.fxml;
    opens com.controlastock.controlastockadminconfig.model to org.hibernate.orm.core;
    opens com.controlastock.controlastockadminconfig.controller to javafx.fxml;

    exports com.controlastock.controlastockadminconfig;
    exports com.controlastock.controlastockadminconfig.controller;
}