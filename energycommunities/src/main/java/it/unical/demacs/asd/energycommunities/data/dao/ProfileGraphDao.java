package it.unical.demacs.asd.energycommunities.data.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.unical.demacs.asd.energycommunities.data.entities.ProfileGraph;

@Repository
public interface ProfileGraphDao extends JpaRepository<ProfileGraph, Long>{

}
