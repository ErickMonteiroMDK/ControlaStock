package com.senac.ControlaStock.application.dto.services;

import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioRequestDto;
import com.senac.ControlaStock.application.dto.itemInventario.ItemInventarioResponseDto;
import com.senac.ControlaStock.domain.entities.ItemInventario;
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

    public List<ItemInventarioResponseDto> listarTodos() {
        return itemInventarioRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public ItemInventarioResponseDto buscarPorId(Long id) {
        ItemInventario item = itemInventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item com ID " + id + " não encontrado."));
        return toResponseDto(item);
    }

    public ItemInventarioResponseDto criarItem(ItemInventarioRequestDto requestDto) {
        ItemInventario novoItem = toEntity(requestDto);
        ItemInventario itemSalvo = itemInventarioRepository.save(novoItem);
        return toResponseDto(itemSalvo);
    }

    public ItemInventarioResponseDto atualizarItem(Long id, ItemInventarioRequestDto requestDto) {
        ItemInventario itemExistente = itemInventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item com ID " + id + " não encontrado para atualização."));

        itemExistente.setNome(requestDto.nome());
        itemExistente.setDescricao(requestDto.descricao());
        itemExistente.setQuantidade(requestDto.quantidade());

        // Aplicar a mesma lógica de valor padrão para atualização
        String localizacao = requestDto.localizacao();
        if (localizacao == null || localizacao.trim().isEmpty()) {
            localizacao = "Estoque Principal";
        }
        itemExistente.setLocalizacao(localizacao);

        ItemInventario itemAtualizado = itemInventarioRepository.save(itemExistente);
        return toResponseDto(itemAtualizado);
    }

    public void removerItem(Long id) {
        if (!itemInventarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item com ID " + id + " não encontrado para remoção.");
        }
        itemInventarioRepository.deleteById(id);
    }

    public ItemInventarioResponseDto adicionarQuantidade(Long id, Integer quantidade) {
        ItemInventario item = itemInventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item com ID " + id + " não encontrado."));

        item.setQuantidade(item.getQuantidade() + quantidade);
        ItemInventario itemAtualizado = itemInventarioRepository.save(item);
        return toResponseDto(itemAtualizado);
    }

    public ItemInventarioResponseDto removerQuantidade(Long id, Integer quantidade) {
        ItemInventario item = itemInventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item com ID " + id + " não encontrado."));

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

        // Define valor padrão se localização for nula ou vazia
        String localizacao = dto.localizacao();
        if (localizacao == null || localizacao.trim().isEmpty()) {
            localizacao = "Estoque Principal"; // valor padrão
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