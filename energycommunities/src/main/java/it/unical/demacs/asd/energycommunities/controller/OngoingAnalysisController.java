package it.unical.demacs.asd.energycommunities.controller;

import it.unical.demacs.asd.energycommunities.data.dao.OngoingAnalysisDao;
import it.unical.demacs.asd.energycommunities.data.entities.OngoingAnalysis;
import it.unical.demacs.asd.energycommunities.data.services.OngoingAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ongoing")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class OngoingAnalysisController {

    private final OngoingAnalysisService ongoingAnalysisService;

    @GetMapping("/{userId}")
    public List<OngoingAnalysis> getOngoing(@PathVariable Long userId) {
        return ongoingAnalysisService.findByUserId(userId);
    }

    @GetMapping("/open/{id}")
    public void openCompletedAnalysis(@PathVariable Long id) {
/*
        OngoingAnalysis analysis = ongoingAnalysisDao.findById(id).orElseThrow();

        AnalysisOpenDto dto = new AnalysisOpenDto();
        dto.setStatus(analysis.getStatus());
        dto.setResultModel(analysis.getResultModel());


 */
        ongoingAnalysisService.deleteById(id);

        // return ResponseEntity.ok(dto);
    }
}
