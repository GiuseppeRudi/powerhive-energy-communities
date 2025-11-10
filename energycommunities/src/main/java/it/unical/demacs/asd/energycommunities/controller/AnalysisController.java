package it.unical.demacs.asd.energycommunities.controller;


import it.unical.demacs.asd.energycommunities.clingo.ASPService;
import it.unical.demacs.asd.energycommunities.clingo.MockDataGenerator;
import it.unical.demacs.asd.energycommunities.clingo.MockDataGenerator2;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.dto.analysis.Analysis2Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis1Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis2Dto;
import it.unical.demacs.asd.energycommunities.data.entities.Member;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.data.services.HistoryService;
import it.unical.demacs.asd.energycommunities.data.services.MemberService;
import it.unical.demacs.asd.energycommunities.data.services.UserService;
import it.unical.demacs.asd.energycommunities.data.utils.ProfileType;
import it.unical.demacs.asd.energycommunities.data.utils.ProfileUtils;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis_1Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis_2Dto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberSummaryDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@RestController
@RequestMapping("/analysis")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class AnalysisController {

    private final ASPService aspService;
    private final MemberService memberService;
    private final ModelMapper modelMapper;


    @GetMapping(value = "/start_1")
    public ResponseEntity<ResultAnalysis1Dto> startFirstAnalysis(){
        User user = MockDataGenerator.createMockUser();
        ResultAnalysis1Dto resultAnalysis1Dto = aspService.chooseBestProfiles(user);

        System.out.println("Best Profiles per members:");
        for(MemberDetailDto m: resultAnalysis1Dto.getAssignments()) {
            System.out.println(m.getFullName());
            System.out.println("Member " + m.getId() + " " + m.getMemberType() + ": ");
            for(ProfileDto p : m.getProfiles()) {
                System.out.print("  Profile " + p.getId() + " " + p.getProfileType() + ": ");
                for(int i=0; i<p.getGraph().size(); i++){
                    System.out.print(p.getGraph().get(i) + " ");
                }
                System.out.println();
            }
            System.out.println("\n");
        }
        // System.out.println("KPI_1: " + resultAnalysis1Dto.getKpi1());
        // System.out.println("KPI_2: " + resultAnalysis1Dto.getKpi2());

        return ResponseEntity.ok(resultAnalysis1Dto);
    }

    @PostMapping(value = "/start_2")
    public ResponseEntity<ResultAnalysis2Dto> startSecondAnalysis(@RequestBody Analysis2Dto request){
        List<MemberSummaryDto> members = request.getMembers();
        int dimCommunity = request.getDimCommunity();
        User user = MockDataGenerator2.createMockUser();
        ResultAnalysis2Dto resultAnalysis2Dto = aspService.generateOptimalCommunity(user,dimCommunity);

        System.out.println("Optimal community of " + dimCommunity + " members:");
        for(MemberDetailDto m: resultAnalysis2Dto.getAssignments()) {
            System.out.println(m.getFullName());
            System.out.println("Member " + m.getId() + " " + m.getMemberType() + ": ");
            for(ProfileDto p : m.getProfiles()) {
                System.out.print("  Profile " + p.getId() + " " + p.getProfileType() + ": ");
                for(int i=0; i<p.getGraph().size(); i++){
                    System.out.print(p.getGraph().get(i) + " ");
                }
                System.out.println();
            }
            System.out.println("\n");
        }
        // System.out.println("KPI_1: " + resultAnalysis1Dto.getKpi1());
        // System.out.println("KPI_2: " + resultAnalysis1Dto.getKpi2());

        return ResponseEntity.ok(resultAnalysis2Dto);
    }
/*
    @GetMapping(value = "/start_2")
    public ResponseEntity<ResultAnalysis_2Dto> startFirstAnalysis(
            @RequestParam List<Long> memberIds) {

        // Recupera i membri completi dal DB
        List<MemberDetailDto> memberDetails = memberService.findAllById(memberIds);

        List<MemberDetailDto> averagedMembers = new ArrayList<>();


        for (MemberDetailDto member : memberDetails) {
            // Ottieni tutti i profili associati al membro
            List<ProfileDto> profiles = member.getProfiles().stream()
                    .map(profile -> {
                        ProfileDto dto = modelMapper.map(profile, ProfileDto.class);
                        return dto;
                    })
                    .collect(Collectors.toList());

            // Calcola i profili medi per PRODUCER e CONSUMER
            ProfileDto avgProducer = ProfileUtils.computeAverageProfile(profiles, ProfileType.PRODUCER);
            ProfileDto avgConsumer = ProfileUtils.computeAverageProfile(profiles, ProfileType.CONSUMER);

            // Crea nuovo MemberDetailDto con i profili medi
            MemberDetailDto memberDto = new MemberDetailDto();
            memberDto.setId(member.getId());
            memberDto.setFullName(member.getFullName());
            memberDto.setMemberType(member.getMemberType());
            memberDto.setProfiles(
                    Stream.of(avgProducer, avgConsumer)
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList())
            );

            averagedMembers.add(memberDto);
        }

        // Crea il risultato finale
        ResultAnalysis_2Dto result = new ResultAnalysis_2Dto();
        result.setAssignments(averagedMembers);
//        result.setKpi1(0.0);
//        result.setKpi2(0.0);

        return ResponseEntity.ok(result);
    }
*/


}