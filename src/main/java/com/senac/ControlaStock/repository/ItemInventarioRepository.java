package com.senac.ControlaStock.repository;

import com.senac.ControlaStock.model.ItemInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemInventarioRepository extends JpaRepository<ItemInventario, Long> {

    List<ItemInventario> findByNomeContainingIgnoreCase(String nome);

    List<ItemInventario> findByLocalizacaoContainingIgnoreCase(String localizacao);
}