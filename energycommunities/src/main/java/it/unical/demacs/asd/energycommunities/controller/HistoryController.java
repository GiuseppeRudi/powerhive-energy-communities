package it.unical.demacs.asd.energycommunities.controller;

import com.fasterxml.jackson.databind.JsonNode;
import it.unical.demacs.asd.energycommunities.dto.history.HistoryDetailDto;
import it.unical.demacs.asd.energycommunities.dto.analysis.SaveAnalysisRequestDto;
import it.unical.demacs.asd.energycommunities.dto.history.HistorySummaryDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import it.unical.demacs.asd.energycommunities.data.services.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;

import java.util.List;


@RestController
@RequestMapping("/history")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("/getAll/{userId}")
    public ResponseEntity<List<HistorySummaryDto>> getHistories(@PathVariable Long userId) {

        System.out.println(userId);
        List<HistorySummaryDto> histories = historyService.getAllHistoriesByUserId(userId);

        System.out.println(histories);

        return new ResponseEntity<>(histories, HttpStatus.OK);
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<HistoryDetailDto> getHistoryById(@PathVariable Long id) {
        HistoryDetailDto historyDto = historyService.getHistoryById(id);
        if (historyDto != null) {
            return ResponseEntity.ok(historyDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping(value = "/save")
    public ResponseEntity<String> saveAnalysis(@RequestBody SaveAnalysisRequestDto saveAnalysisRequestDto) {
        try {

            Long userId = saveAnalysisRequestDto.getUserId();
            Integer analysisNumber = saveAnalysisRequestDto.getAnalysisNumber();
            JsonNode analysisData = saveAnalysisRequestDto.getAnalysisData();
            String analysisName = saveAnalysisRequestDto.getAnalysisName();

            HistoryDetailDto savedHistory = historyService.saveAnalysis(userId, analysisNumber, analysisData,analysisName);

            return ResponseEntity.ok("Analysis saved successfully with id: " + savedHistory.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/getMembers/{id}")
    public ResponseEntity<Object> getHistoryMembers(@PathVariable Long id) {
        HistoryDetailDto historyDto = historyService.getHistoryById(id);
        if (historyDto == null) {
            return ResponseEntity.notFound().build();
        }
        JsonNode analysisData = historyDto.getAnalysisData();
        if (analysisData == null) {
            return ResponseEntity.ok(JsonNodeFactory.instance.arrayNode());
        }
        JsonNode membersNode = analysisData.path("assignments");
        return ResponseEntity.ok(membersNode);
    }
}

