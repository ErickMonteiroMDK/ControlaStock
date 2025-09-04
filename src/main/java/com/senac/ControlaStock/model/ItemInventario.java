package com.senac.ControlaStock.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemInventario {

    @Id
    @GeneratedValue
    private long id;

    private String nome;
    private int quantidade;
    private String localizacao;
}
