package com.senac.ControlaStock.services;

import com.senac.ControlaStock.model.ItemInventario;
import com.senac.ControlaStock.repository.ItemInventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemInventarioService {

    @Autowired
    private ItemInventarioRepository itemInventarioRepository;

    public List<ItemInventario> listarTodos() {
        return itemInventarioRepository.findAll();
    }

    public Optional<ItemInventario> buscarPorId(Long id) {
        return itemInventarioRepository.findById(id);
    }

    public Optional<ItemInventario> buscarPorNome(String nome) {
        return itemInventarioRepository.findByNome(nome);
    }

    public ItemInventario salvar(ItemInventario itemInventario) {
        return itemInventarioRepository.save(itemInventario);
    }

    public void deletar(Long id) {
        itemInventarioRepository.deleteById(id);
    }

    public ItemInventario atualizarQuantidade(Long id, Integer novaQuantidade) {
        Optional<ItemInventario> itemOpt = itemInventarioRepository.findById(id);
        if (itemOpt.isPresent()) {
            ItemInventario item = itemOpt.get();
            item.setQuantidade(novaQuantidade);
            return itemInventarioRepository.save(item);
        }
        throw new IllegalArgumentException("Item não encontrado com ID: " + id);
    }
}
