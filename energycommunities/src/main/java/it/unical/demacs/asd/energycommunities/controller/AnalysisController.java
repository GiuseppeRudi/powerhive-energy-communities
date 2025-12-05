package it.unical.demacs.asd.energycommunities.controller;

import it.unical.demacs.asd.energycommunities.clingo.ASPFactMapper;
import it.unical.demacs.asd.energycommunities.clingo.ASPService;
import it.unical.demacs.asd.energycommunities.clingo.mock.MockDataGenerator1;
import it.unical.demacs.asd.energycommunities.clingo.mock.MockDataGenerator2;
import it.unical.demacs.asd.energycommunities.clingo.mock.MockDataGenerator4;
import it.unical.demacs.asd.energycommunities.data.dao.BatteryDao;
import it.unical.demacs.asd.energycommunities.data.dao.MemberDao;
import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.entities.Battery;
import it.unical.demacs.asd.energycommunities.data.entities.Member;
import it.unical.demacs.asd.energycommunities.data.entities.OngoingAnalysis;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.data.services.BatteryService;
import it.unical.demacs.asd.energycommunities.data.services.OngoingAnalysisService;
import it.unical.demacs.asd.energycommunities.data.services.MemberService;
import it.unical.demacs.asd.energycommunities.dto.analysis.request.Analysis2Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.request.Analysis3Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.request.Analysis4Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.request.AsyncAnalysisDto;
import it.unical.demacs.asd.energycommunities.dto.analysis.result.ResultAnalysis1Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.result.ResultAnalysis2Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.result.ResultAnalysis3Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.result.ResultAnalysis4Dto;
import it.unical.demacs.asd.energycommunities.dto.battery.BatteryDto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/analysis")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class AnalysisController {

    private final ASPService aspService;
    private final MemberService memberService;
    private final ModelMapper modelMapper;
    private final OngoingAnalysisService ongoingAnalysisService;
    private final UserDao userDao;
    private final MemberDao memberDao;
    private final BatteryDao batteryDao;
    private final BatteryService batteryService;

    @GetMapping(value = "/start_1")
    public ResponseEntity<ResultAnalysis1Dto> startFirstAnalysis(@RequestParam(required = false) List<Long> memberIds) {

        List<MemberDetailDto> selectedMembers;

        ResultAnalysis1Dto resultAnalysis1Dto;

        if (memberIds != null && !memberIds.isEmpty()) {
            selectedMembers = memberService.findAllById(memberIds);
            resultAnalysis1Dto = aspService.chooseBestProfiles(selectedMembers);
        }
        else {
            List<MemberDetailDto> members  = MockDataGenerator1.generateListOfMembers();
            resultAnalysis1Dto = aspService.chooseBestProfiles(members);
        }
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
        }


        return ResponseEntity.ok(resultAnalysis1Dto);
    }

    @PostMapping(value = "/start_2")
    public ResponseEntity<ResultAnalysis2Dto> startSecondAnalysis(@RequestBody Analysis2Dto request){
         List<MemberDetailDto> members = request.getMembers();
        int dimCommunity = request.getDimCommunity();
//        List<MemberDetailDto> members  = MockDataGenerator2.generateListOfMembers();
        ResultAnalysis2Dto resultAnalysis2Dto = aspService.generateOptimalCommunityDim(members,dimCommunity);

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

    @PostMapping(value = "/start_3")
    public ResponseEntity<ResultAnalysis3Dto> startThirdAnalysis(@RequestBody Analysis3Dto request){
        System.out.println("Request :" + request.toString() );

        List<MemberDetailDto> members = request.getMembers();
        List<Long> wantToRemove = request.getWantToRemove();
        List<Long> wantToAdd = request.getWantToAdd();

        System.out.println("Members:" + members.toString());

        System.out.println("Want to add:" + wantToAdd.toString());
        System.out.println("Want to remove:" + wantToRemove.toString());

//        wantToAdd.add(1L);
//        wantToAdd.add(2L);
//        wantToRemove.add(8L);
//        List<MemberDetailDto> mockMembers = MockDataGenerator2.generateListOfMembers();
        ResultAnalysis3Dto resultAnalysis3Dto = aspService.generateOptimalCommunity(members,wantToAdd,wantToRemove);

        System.out.print("Default community: ");
        for(MemberDetailDto m: resultAnalysis3Dto.getDefaultCommunity().getAssignments()) System.out.print(m.getId() + " ");
        System.out.println();

        System.out.print("Optimal community: ");
        for(MemberDetailDto m: resultAnalysis3Dto.getOptimalCommunity().getAssignments()) System.out.print(m.getId() + " ");
        System.out.println();

        System.out.print("Wanted community: ");
        for(MemberDetailDto m: resultAnalysis3Dto.getWantedCommunity().getAssignments()) System.out.print(m.getId() + " ");
        System.out.println();

        return ResponseEntity.ok(resultAnalysis3Dto);
    }


    @PostMapping(value = "/start_4")
    public ResponseEntity<ResultAnalysis4Dto> startFourthAnalysis(@RequestBody Analysis4Dto request){
//        System.out.println("Request :" + request.toString() );
//
//        List<MemberDetailDto> members = request.getMembers();
//        List<BatteryDto> batteries = request.getBatteries();
//        int budget = request.getBudget();
//
//        System.out.println("Members:" + members.toString());
//        System.out.println("Batteries: " + batteries.toString());
//        System.out.println("Budget:" + budget);


        List<MemberDetailDto> mockMembers = MockDataGenerator4.generateListOfMembers();
        List<BatteryDto> mockBattery = MockDataGenerator4.generateListBatteries();
        int mockBudget = MockDataGenerator4.generateBudget();

        ResultAnalysis4Dto resultAnalysis4Dto = aspService.generateChooseBatteries(mockMembers,mockBattery,mockBudget);

        return ResponseEntity.ok(resultAnalysis4Dto);
    }


    @PostMapping(value = "/async")
    public ResponseEntity<Long> runAnalysisAsync(@RequestBody AsyncAnalysisDto payload) {

        List<MemberDetailDto> selectedMembers;
        List<BatteryDto> selectedBatteries;

        OngoingAnalysis entity = new OngoingAnalysis();
        int type = payload.getAnalysis();
        System.out.println(payload);
        User user = userDao.findById(payload.getUserId())
                .orElseThrow(() -> new RuntimeException("User non trovato"));
        //System.out.println("User id: " + user.getId());
        entity.setUser(user);
        entity.setAnalysisType(type);
        //System.out.println("Analysis type: " + type);
        List<Member> members = memberDao.findAllById(payload.getMemberIds());
        //System.out.println("Members:" + members);
        entity.setMembers(members);
        if(type==4){
            entity.setBatteries(batteryDao.findAllById(payload.getBatteries()));
        }
        if(type==3){
            entity.setWantToAdd(payload.getWantToAdd());
            entity.setWantToRemove(payload.getWantToRemove());
        }
        entity.setStatus("PENDING");

        entity = ongoingAnalysisService.save(entity);

        if (payload.getMemberIds() != null && !payload.getMemberIds().isEmpty()) {
            selectedMembers = memberService.findAllById(payload.getMemberIds());
        }
        else selectedMembers  = MockDataGenerator1.generateListOfMembers();
        if (payload.getBatteries() != null && !payload.getBatteries().isEmpty()) {
            selectedBatteries = batteryService.findAllById(payload.getBatteries());
        }
        else selectedBatteries = MockDataGenerator4.generateListBatteries();

        String facts;
        if(type==1){
            facts = ASPFactMapper.toFacts1(selectedMembers);
        } else if(type==2){
            facts = ASPFactMapper.toFacts2(selectedMembers,2,payload.getDim());
        } else if(type==3){
            facts = ASPFactMapper.toFacts3(selectedMembers,payload.getWantToAdd(), payload.getWantToRemove());
        } else {
            facts = ASPFactMapper.toFacts4(
                selectedMembers,
                selectedBatteries,
                payload.getBudget()!= null ? payload.getBudget() : MockDataGenerator4.generateBudget()
            );
        }

        aspService.startAsyncAnalysis(entity.getId(),type,facts, selectedMembers, selectedBatteries, payload.getWantToAdd(), payload.getWantToRemove());
        // System.out.println(entity.getId());
        return ResponseEntity.ok(entity.getId());
    }


}
