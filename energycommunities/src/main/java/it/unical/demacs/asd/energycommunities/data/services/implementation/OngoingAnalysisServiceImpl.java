package it.unical.demacs.asd.energycommunities.data.services.implementation;

import it.unical.demacs.asd.energycommunities.data.dao.OngoingAnalysisDao;
import it.unical.demacs.asd.energycommunities.data.entities.OngoingAnalysis;
import it.unical.demacs.asd.energycommunities.data.services.OngoingAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OngoingAnalysisServiceImpl implements OngoingAnalysisService {

    private final OngoingAnalysisDao ongoingAnalysisDao;

    public List<OngoingAnalysis> findByUserId(Long userId) {
        return ongoingAnalysisDao.findByUserId(userId);
    }

    public OngoingAnalysis save(OngoingAnalysis entity) {
        return ongoingAnalysisDao.save(entity);
    }

    @Override
    public void deleteById(Long id) {
        ongoingAnalysisDao.deleteById(id);
    }
}
