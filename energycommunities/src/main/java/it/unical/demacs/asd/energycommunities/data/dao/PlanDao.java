package it.unical.demacs.asd.energycommunities.data.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.unical.demacs.asd.energycommunities.data.entities.Plan;
import it.unical.demacs.asd.energycommunities.data.entities.User;

import java.util.Optional;


@Repository
public interface PlanDao extends JpaRepository<Plan, Long> {

    Optional<Plan> findByUser(User user);

}
