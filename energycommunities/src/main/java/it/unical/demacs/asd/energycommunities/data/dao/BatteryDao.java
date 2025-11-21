package it.unical.demacs.asd.energycommunities.data.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.unical.demacs.asd.energycommunities.data.entities.Battery;

@Repository
public interface BatteryDao extends JpaRepository<Battery, Long> {

}
