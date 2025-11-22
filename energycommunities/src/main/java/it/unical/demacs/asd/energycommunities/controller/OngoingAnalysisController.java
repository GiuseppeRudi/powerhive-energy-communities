package it.unical.demacs.asd.energycommunities.controller;

import it.unical.demacs.asd.energycommunities.clingo.ASPService;
import it.unical.demacs.asd.energycommunities.data.dao.MemberDao;
import it.unical.demacs.asd.energycommunities.data.dao.OngoingAnalysisDao;
import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.entities.Member;
import it.unical.demacs.asd.energycommunities.data.entities.OngoingAnalysis;
import it.unical.demacs.asd.energycommunities.data.services.OngoingAnalysisService;
import it.unical.demacs.asd.energycommunities.dto.analysis.OngoingAnalysisDto;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis1Dto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ongoing")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class OngoingAnalysisController {

    private final OngoingAnalysisService ongoingAnalysisService;
    private final ASPService aspService;
    private final UserDao userDao;
    private final MemberDao memberDao;
    private final ModelMapper modelMapper;

    @GetMapping("/{userId}")
    public List<OngoingAnalysisDto> getOngoing(@PathVariable Long userId) {
        return ongoingAnalysisService.findByUserId(userId);
    }

    @GetMapping("/open/{id}")
    public ResponseEntity<ResultAnalysis1Dto> openCompletedAnalysis(@PathVariable Long id) {

        OngoingAnalysis analysis = ongoingAnalysisService.findById(id);

        List<MemberDetailDto> members = analysis.getMembers().stream()
                .map(member -> modelMapper.map(member, MemberDetailDto.class))
                .toList();


        ResultAnalysis1Dto dto = null;
        if(analysis.getResultModel() != null) {
            dto = aspService.createBestModel1Dto(members, analysis.getResultModel().split(" "));
        }
        ongoingAnalysisService.deleteById(id);

        return ResponseEntity.ok(dto);
    }
}
