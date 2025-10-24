package it.unical.demacs.asd.energycommunities.data.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.unical.demacs.asd.energycommunities.data.entities.User;

@Repository
public interface UserDao extends JpaRepository<User, Long>{
    Optional<User> findByUsername(String username);
}
