package it.unical.demacs.asd.energycommunities.controller;


import it.unical.demacs.asd.energycommunities.clingo.ASPService;
import it.unical.demacs.asd.energycommunities.clingo.MockDataGenerator;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.dto.BestModelDto;
import it.unical.demacs.asd.energycommunities.dto.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/analysis")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class AnalysisController {

    private final ASPService aspService;

    @GetMapping(value = "/start")
    public ResponseEntity<BestModelDto> startFirstAnalysis(){
        User user = MockDataGenerator.createMockUser();
        BestModelDto bestModelDto = aspService.chooseBestProfiles(user);

        System.out.println("Best Profiles per members:");
        for(MemberDetailDto m: bestModelDto.getAssignments()) {
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
        System.out.println("KPI_1: " + bestModelDto.getKpi1());
        System.out.println("KPI_2: " + bestModelDto.getKpi2());

        return ResponseEntity.ok(bestModelDto);
    }

}