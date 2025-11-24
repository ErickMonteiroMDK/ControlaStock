package com.controlastock.controlastockadminconfig.model.DAO;

import com.controlastock.controlastockadminconfig.model.Usuario;
import jakarta.persistence.EntityManager;

public class UsuarioDAO {

    private EntityManager entityManager;

    public UsuarioDAO(EntityManager entityManager){

        this.entityManager = entityManager;
    }

    public void salvar(Usuario e){
        entityManager.getTransaction().begin();

        entityManager.persist(e);

        entityManager.getTransaction().commit();
    }

}
