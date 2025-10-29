package it.unical.demacs.asd.energycommunities.data.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.unical.demacs.asd.energycommunities.data.entities.Profile;

@Repository
public interface ProfileDao extends JpaRepository<Profile, Long> {

}
