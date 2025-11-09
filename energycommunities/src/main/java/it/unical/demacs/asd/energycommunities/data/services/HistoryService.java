package it.unical.demacs.asd.energycommunities.data.services;

import com.fasterxml.jackson.databind.JsonNode;
import it.unical.demacs.asd.energycommunities.dto.history.HistoryDetailDto;
import it.unical.demacs.asd.energycommunities.dto.history.HistorySummaryDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface HistoryService {


    HistoryDetailDto saveAnalysis(Long userId, Integer analysisNumber, JsonNode analysisData, String analysisName);

    List<HistorySummaryDto> getAllHistoriesByUserId(Long userId);

    HistoryDetailDto getHistoryById(Long historyId);
}
