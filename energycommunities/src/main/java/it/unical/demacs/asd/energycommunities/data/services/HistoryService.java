package it.unical.demacs.asd.energycommunities.data.services;

import com.fasterxml.jackson.databind.JsonNode;
import it.unical.demacs.asd.energycommunities.data.entities.History;
import org.springframework.stereotype.Service;

@Service
public interface HistoryService {


    History saveAnalysis(Long userId, Integer analysisNumber, JsonNode analysisData);
}
