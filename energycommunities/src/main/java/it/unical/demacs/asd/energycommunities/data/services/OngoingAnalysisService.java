package it.unical.demacs.asd.energycommunities.data.services;

import it.unical.demacs.asd.energycommunities.data.entities.OngoingAnalysis;
import it.unical.demacs.asd.energycommunities.dto.analysis.OngoingAnalysisDto;

import java.util.List;


public interface OngoingAnalysisService  {
    List<OngoingAnalysisDto> findByUserId(Long userId);

    OngoingAnalysis save(OngoingAnalysis entity);

    void deleteById(Long id);
}
