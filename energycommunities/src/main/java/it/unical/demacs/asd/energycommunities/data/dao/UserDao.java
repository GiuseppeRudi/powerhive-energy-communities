package it.unical.demacs.asd.energycommunities.data.dao;

import java.util.List;
import java.util.Optional;

import it.unical.demacs.asd.energycommunities.dto.user.UserDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.unical.demacs.asd.energycommunities.data.entities.User;

@Repository
public interface UserDao extends JpaRepository<User, Long>{
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<UserDto> getAllById(Long id);
}
