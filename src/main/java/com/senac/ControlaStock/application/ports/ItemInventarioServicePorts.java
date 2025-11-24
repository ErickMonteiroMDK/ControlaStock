package com.senac.ControlaStock.application.ports;

import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioRequestDto;
import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioResponseDto;
import com.senac.ControlaStock.domain.entities.Usuario;

import java.util.List;

public interface ItemInventarioServicePorts {
    List<ItemInventarioResponseDto> listarTodos(Usuario usuarioLogado);
    ItemInventarioResponseDto buscarPorId(Long id, Usuario usuarioLogado);
    ItemInventarioResponseDto criarItem(ItemInventarioRequestDto requestDto, Usuario usuarioLogado);
    ItemInventarioResponseDto atualizarItem(Long id, ItemInventarioRequestDto requestDto, Usuario usuarioLogado);
    void removerItem(Long id, Usuario usuarioLogado);
    ItemInventarioResponseDto adicionarQuantidade(Long id, Integer quantidade, Usuario usuarioLogado);
    ItemInventarioResponseDto removerQuantidade(Long id, Integer quantidade, Usuario usuarioLogado);
}
