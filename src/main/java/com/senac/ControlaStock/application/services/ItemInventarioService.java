package com.senac.ControlaStock.application.services;

import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioRequestDto;
import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioResponseDto;
import com.senac.ControlaStock.domain.entities.ItemInventario;
import com.senac.ControlaStock.domain.entities.Usuario;
import com.senac.ControlaStock.domain.repository.ItemInventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemInventarioService {

    @Autowired
    private ItemInventarioRepository itemInventarioRepository;

    public List<ItemInventarioResponseDto> listarTodos(Usuario usuarioLogado) {
        return itemInventarioRepository.findByUsuario(usuarioLogado)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public ItemInventarioResponseDto buscarPorId(Long id, Usuario usuarioLogado) {
        ItemInventario item = itemInventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado."));

        // Verificar se o item pertence ao usuário logado
        if (!item.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para acessar este item.");
        }

        return toResponseDto(item);
    }

    public ItemInventarioResponseDto criarItem(ItemInventarioRequestDto requestDto, Usuario usuarioLogado) {
        ItemInventario novoItem = toEntity(requestDto);
        novoItem.setUsuario(usuarioLogado);

        ItemInventario itemSalvo = itemInventarioRepository.save(novoItem);
        return toResponseDto(itemSalvo);
    }

    public ItemInventarioResponseDto atualizarItem(Long id, ItemInventarioRequestDto requestDto, Usuario usuarioLogado) {
        ItemInventario itemExistente = itemInventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado."));

        if (!itemExistente.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para atualizar este item.");
        }

        itemExistente.setNome(requestDto.nome());
        itemExistente.setDescricao(requestDto.descricao());
        itemExistente.setQuantidade(requestDto.quantidade());

        String localizacao = requestDto.localizacao();
        if (localizacao == null || localizacao.trim().isEmpty()) {
            localizacao = "Estoque Principal";
        }
        itemExistente.setLocalizacao(localizacao);

        ItemInventario itemAtualizado = itemInventarioRepository.save(itemExistente);
        return toResponseDto(itemAtualizado);
    }

    public void removerItem(Long id, Usuario usuarioLogado) {
        ItemInventario item = itemInventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado."));

        if (!item.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para remover este item.");
        }

        itemInventarioRepository.deleteById(id);
    }

    public ItemInventarioResponseDto adicionarQuantidade(Long id, Integer quantidade, Usuario usuarioLogado) {
        ItemInventario item = itemInventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado."));

        if (!item.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para modificar este item.");
        }

        item.setQuantidade(item.getQuantidade() + quantidade);
        ItemInventario itemAtualizado = itemInventarioRepository.save(item);
        return toResponseDto(itemAtualizado);
    }

    public ItemInventarioResponseDto removerQuantidade(Long id, Integer quantidade, Usuario usuarioLogado) {
        ItemInventario item = itemInventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado."));

        if (!item.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para modificar este item.");
        }

        if (item.getQuantidade() < quantidade) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade a ser removida é maior que o estoque atual.");
        }

        item.setQuantidade(item.getQuantidade() - quantidade);
        ItemInventario itemAtualizado = itemInventarioRepository.save(item);
        return toResponseDto(itemAtualizado);
    }

    private ItemInventario toEntity(ItemInventarioRequestDto dto) {
        ItemInventario entity = new ItemInventario();
        entity.setNome(dto.nome());
        entity.setDescricao(dto.descricao());
        entity.setQuantidade(dto.quantidade());

        String localizacao = dto.localizacao();
        if (localizacao == null || localizacao.trim().isEmpty()) {
            localizacao = "Estoque Principal";
        }
        entity.setLocalizacao(localizacao);

        return entity;
    }

    private ItemInventarioResponseDto toResponseDto(ItemInventario entity) {
        return new ItemInventarioResponseDto(
                entity.getId(),
                entity.getNome(),
                entity.getDescricao(),
                entity.getQuantidade(),
                entity.getLocalizacao()
        );
    }
}