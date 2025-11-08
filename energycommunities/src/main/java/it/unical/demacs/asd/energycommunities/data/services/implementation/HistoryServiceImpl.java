package it.unical.demacs.asd.energycommunities.data.services.implementation;

import com.fasterxml.jackson.databind.JsonNode;
import it.unical.demacs.asd.energycommunities.data.dao.HistoryDao;
import it.unical.demacs.asd.energycommunities.data.entities.History;
import it.unical.demacs.asd.energycommunities.data.services.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {


    private final HistoryDao historyDao;

    @Override
    public History saveAnalysis(Long userId, Integer analysisNumber, JsonNode analysisData) {
        History history = new History();
        history.setUserId(userId);
        history.setAnalysisNumber(analysisNumber);
        history.setAnalysisData(analysisData);
        return historyDao.save(history);
    }
}
