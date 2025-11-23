package it.unical.demacs.asd.energycommunities.data.dao;

import it.unical.demacs.asd.energycommunities.data.entities.OngoingAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OngoingAnalysisDao extends JpaRepository<OngoingAnalysis, Long> {
    List<OngoingAnalysis> findByUserId(Long id);
}
