package it.unical.demacs.asd.energycommunities.data.dao;

import it.unical.demacs.asd.energycommunities.data.entities.History;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface HistoryDao extends JpaRepository<History, Long> {

    List<History> getHistoriesByUserId(Long userId);

    Long user(User user);


    void deleteById(Long id);

}

