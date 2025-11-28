package it.unical.demacs.asd.energycommunities.data.services.implementation;

import it.unical.demacs.asd.energycommunities.data.dao.MemberDao;
import it.unical.demacs.asd.energycommunities.data.dao.OngoingAnalysisDao;
import it.unical.demacs.asd.energycommunities.data.entities.OngoingAnalysis;
import it.unical.demacs.asd.energycommunities.data.services.OngoingAnalysisService;
import it.unical.demacs.asd.energycommunities.dto.analysis.result.OngoingAnalysisDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OngoingAnalysisServiceImpl implements OngoingAnalysisService {

    private final ModelMapper modelMapper;
    private final OngoingAnalysisDao ongoingAnalysisDao;
    private final MemberDao memberDao;

    public List<OngoingAnalysisDto> findByUserId(Long userId) {
        List<OngoingAnalysis> ongoingAnalysis = ongoingAnalysisDao.findByUserId(userId);
        return ongoingAnalysis.stream()
                .map(analysis -> modelMapper.map(analysis, OngoingAnalysisDto.class))
                .toList();
    }

    public OngoingAnalysis save(OngoingAnalysis entity) {
        return ongoingAnalysisDao.save(entity);
    }

    @Override
    public void deleteById(Long id) {
        ongoingAnalysisDao.deleteById(id);
    }

    @Override
    public OngoingAnalysis findById(Long id) {
        return ongoingAnalysisDao.findById(id).orElse(null);
    }
}
