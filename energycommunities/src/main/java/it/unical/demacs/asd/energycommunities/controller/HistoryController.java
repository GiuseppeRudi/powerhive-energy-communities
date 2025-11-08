package it.unical.demacs.asd.energycommunities.controller;

import com.fasterxml.jackson.databind.JsonNode;
import it.unical.demacs.asd.energycommunities.data.entities.History;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis_1Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.SaveAnalysisRequestDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import it.unical.demacs.asd.energycommunities.data.services.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/history")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;


    @PostMapping(value = "/save")
    public ResponseEntity<String> saveAnalysis(@RequestBody SaveAnalysisRequestDto saveAnalysisRequestDto) {
        try {
            Long userId = saveAnalysisRequestDto.getUserId();
            Integer analysisNumber = saveAnalysisRequestDto.getAnalysisNumber();
            JsonNode analysisData = saveAnalysisRequestDto.getAnalysisData();

            History savedHistory = historyService.saveAnalysis(userId, analysisNumber, analysisData);

            return ResponseEntity.ok("Analysis saved successfully with id: " + savedHistory.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


}

