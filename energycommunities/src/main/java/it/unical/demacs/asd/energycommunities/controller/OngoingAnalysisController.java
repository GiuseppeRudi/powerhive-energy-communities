package it.unical.demacs.asd.energycommunities.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import it.unical.demacs.asd.energycommunities.clingo.ASPService;
import it.unical.demacs.asd.energycommunities.data.entities.OngoingAnalysis;
import it.unical.demacs.asd.energycommunities.data.services.OngoingAnalysisService;
import it.unical.demacs.asd.energycommunities.dto.analysis.result.OngoingAnalysisDto;
import it.unical.demacs.asd.energycommunities.dto.analysis.result.ResultAnalysis1Dto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/ongoing")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class OngoingAnalysisController {

    private final OngoingAnalysisService ongoingAnalysisService;
    private final ModelMapper modelMapper;

    @GetMapping("/{userId}")
    public List<OngoingAnalysisDto> getOngoing(@PathVariable Long userId) {
        List<OngoingAnalysisDto> ongoingAnalysisDtos = ongoingAnalysisService.findByUserId(userId);
        for (OngoingAnalysisDto a : ongoingAnalysisDtos) {
            Duration diff = Duration.between(a.getCreatedAt(), LocalDateTime.now());

            if (diff.toMinutes() >= 15 && !a.getStatus().equals("FINISHED") && !a.getStatus().equals("ERROR")) {
                a.setStatus("ERROR");
                ongoingAnalysisService.save(modelMapper.map(a, OngoingAnalysis.class));
            }
        }
        return ongoingAnalysisDtos;
    }

    @GetMapping("/open/{id}")
    public ResponseEntity<JsonNode> openCompletedAnalysis(@PathVariable Long id) {

        OngoingAnalysis analysis = ongoingAnalysisService.findById(id);
        ongoingAnalysisService.deleteById(id);

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();

        node.put("result",analysis.getResultModel());
        node.put("analysis", analysis.getAnalysisType());
        node.put("wantToAdd", objectMapper.valueToTree(analysis.getWantToAdd()));
        node.put("wantToRemove", objectMapper.valueToTree(analysis.getWantToRemove()));


        return ResponseEntity.ok(node);
    }
}
