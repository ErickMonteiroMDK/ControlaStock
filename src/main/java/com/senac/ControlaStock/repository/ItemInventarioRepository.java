package com.senac.ControlaStock.repository;

import com.senac.ControlaStock.model.ItemInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface
ItemInventarioRepository extends JpaRepository<ItemInventario, Integer> {

    Optional<ItemInventario> findByNome(String nome);
}