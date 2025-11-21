package it.unical.demacs.asd.energycommunities.data.services;

import it.unical.demacs.asd.energycommunities.data.entities.OngoingAnalysis;

import java.util.List;


public interface OngoingAnalysisService  {
    List<OngoingAnalysis> findByUserId(Long userId);

    OngoingAnalysis save(OngoingAnalysis entity);

    void deleteById(Long id);
}
