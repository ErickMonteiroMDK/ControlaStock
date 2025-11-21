package com.senac.ControlaStock.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "itens_inventario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemInventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false)
    private String localizacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}