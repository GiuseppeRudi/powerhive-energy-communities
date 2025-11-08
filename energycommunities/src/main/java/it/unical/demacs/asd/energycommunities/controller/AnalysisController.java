package it.unical.demacs.asd.energycommunities.controller;


import it.unical.demacs.asd.energycommunities.clingo.ASPService;
import it.unical.demacs.asd.energycommunities.clingo.MockDataGenerator;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.data.services.HistoryService;
import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis_1Dto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/analysis")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class AnalysisController {

    private final ASPService aspService;


    @GetMapping(value = "/start_1")
    public ResponseEntity<ResultAnalysis_1Dto> startFirstAnalysis(){
        User user = MockDataGenerator.createMockUser();
        ResultAnalysis_1Dto resultAnalysis1Dto = aspService.chooseBestProfiles(user);

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

}