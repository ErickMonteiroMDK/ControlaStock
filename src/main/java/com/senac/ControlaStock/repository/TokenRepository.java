package com.senac.ControlaStock.repository;

import com.senac.ControlaStock.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Integer> { // O tipo do ID foi alterado para Integer.

    Optional<Token> findByToken(String token);
}