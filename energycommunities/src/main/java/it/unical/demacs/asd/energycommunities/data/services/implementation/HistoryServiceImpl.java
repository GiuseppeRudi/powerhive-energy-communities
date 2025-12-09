package it.unical.demacs.asd.energycommunities.data.services.implementation;

import com.fasterxml.jackson.databind.JsonNode;
import it.unical.demacs.asd.energycommunities.data.dao.HistoryDao;
import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.entities.History;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.data.services.HistoryService;
import it.unical.demacs.asd.energycommunities.dto.history.HistoryDetailDto;
import it.unical.demacs.asd.energycommunities.dto.history.HistorySummaryDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {


    private final HistoryDao historyDao;
    private final UserDao userDao;
    private final ModelMapper modelMapper;

    @Override
    public HistoryDetailDto saveAnalysis(Long userId, Integer analysisNumber, JsonNode analysisData, String analysisName) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User non trovato"));

        History history = new History();
        history.setUser(user);
        history.setName(analysisName);
        history.setAnalysisNumber(analysisNumber);
        history.setAnalysisData(analysisData);

        return modelMapper.map(historyDao.save(history), HistoryDetailDto.class);
    }


    @Override
    public List<HistorySummaryDto> getAllHistoriesByUserId(Long userId) {
        List<History> histories = historyDao.getHistoriesByUserId(userId);


        return histories.stream()
                .map(history -> modelMapper.map(history, HistorySummaryDto.class))
                .toList();
    }



    public HistoryDetailDto getHistoryById(Long id) {
        History history = historyDao.findById(id)
                .orElseThrow(() -> new RuntimeException("History non trovata"));
        return modelMapper.map(history, HistoryDetailDto.class);
    }

    @Override
    public void removeHistoryById(Long historyId) {
        historyDao.deleteById(historyId);
    }

}
