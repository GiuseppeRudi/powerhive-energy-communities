package it.unical.demacs.asd.energycommunities.controller;

import it.unical.demacs.asd.energycommunities.clingo.ASPService;
import it.unical.demacs.asd.energycommunities.clingo.MockDataGenerator;
import it.unical.demacs.asd.energycommunities.clingo.MockDataGenerator2;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.dto.analysis.*;
import it.unical.demacs.asd.energycommunities.data.services.MemberService;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analysis")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class AnalysisController {

    private final ASPService aspService;
    private final MemberService memberService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @GetMapping(value = "/start_1")
    public ResponseEntity<ResultAnalysis_1Dto> startFirstAnalysis(
            @RequestParam(required = false) List<Long> memberIds) {

        try {
            // 1. Recupera i membri selezionati dal database con tutti i loro profili
            List<Member> selectedMembers;

            if (memberIds != null && !memberIds.isEmpty()) {
                selectedMembers = memberService.findMemberEntitiesById(memberIds);

                if (selectedMembers.isEmpty()) {
                    return ResponseEntity.badRequest().body(null);
    public ResponseEntity<ResultAnalysis1Dto> startFirstAnalysis(){
        List<MemberDetailDto> members  = MockDataGenerator.createMockUser();
        ResultAnalysis1Dto resultAnalysis1Dto = aspService.chooseBestProfiles(members);

        System.out.println("Best Profiles per members:");
        for(MemberDetailDto m: resultAnalysis1Dto.getAssignments()) {
            System.out.println(m.getFullName());
            System.out.println("Member " + m.getId() + " " + m.getMemberType() + ": ");
            for(ProfileDto p : m.getProfiles()) {
                System.out.print("  Profile " + p.getId() + " " + p.getProfileType() + ": ");
                for(int i=0; i<p.getGraph().size(); i++){
                    System.out.print(p.getGraph().get(i) + " ");
                }
            } else {
                // Se non ci sono memberIds, carica tutti i membri
                // Questo caso non dovrebbe verificarsi con il nuovo flusso, ma è un fallback
                return ResponseEntity.badRequest().body(null);
            }

            // 2. Recupera il Plan dal primo membro (tutti i membri appartengono allo stesso Plan)
            Plan plan = selectedMembers.get(0).getPlan();

            if (plan == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // 3. Recupera l'User dal Plan
            User user = plan.getUser();

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // 4. Imposta i membri selezionati nel plan dell'utente
            plan.setMembers(selectedMembers);
            user.setPlan(plan);

            // 5. Chiama il servizio ASP con i dati reali
            ResultAnalysis_1Dto resultAnalysis1Dto = aspService.chooseBestProfiles(user);

            // 6. Log dei risultati (opzionale)
            System.out.println("=== Analysis 1 Results ===");
            System.out.println("User: " + user.getUsername());
            System.out.println("Selected Members: " + selectedMembers.size());
            System.out.println("Best Profiles per members:");
            for (MemberDetailDto m : resultAnalysis1Dto.getAssignments()) {
                System.out.println("Member " + m.getId() + " - " + m.getFullName() + " (" + m.getMemberType() + ")");
                for (ProfileDto p : m.getProfiles()) {
                    System.out.println("  Profile " + p.getId() + " (" + p.getProfileType() + ")");
                }
            }

            return ResponseEntity.ok(resultAnalysis1Dto);

        } catch (Exception e) {
            System.err.println("Error in startFirstAnalysis: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
            System.out.println("\n");
        }
         System.out.println("KPI_1: " + resultAnalysis1Dto.getKpi1());
         System.out.println("KPI_2: " + resultAnalysis1Dto.getKpi2());

        return ResponseEntity.ok(resultAnalysis1Dto);
    }

    @PostMapping(value = "/start_2")
    public ResponseEntity<ResultAnalysis2Dto> startSecondAnalysis(@RequestBody Analysis2Dto request){
        // List<MemberSummaryDto> members = request.getMembers();
        int dimCommunity = request.getDimCommunity();
        List<MemberDetailDto> members  = MockDataGenerator2.generateListOfMembers();
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

        wantToAdd.add(1L);
        wantToAdd.add(2L);
        wantToRemove.add(8L);
        List<MemberDetailDto> mockMembers = MockDataGenerator2.generateListOfMembers();
        ResultAnalysis3Dto resultAnalysis3Dto = aspService.generateOptimalCommunity(mockMembers,wantToAdd,wantToRemove);

        System.out.print("Default community: ");
        for(MemberDetailDto m: resultAnalysis3Dto.getDefaultCommunity().getAssignments()) System.out.print(m.getId() + " ");
        System.out.println();

        System.out.print("Optimal community: ");
        for(MemberDetailDto m: resultAnalysis3Dto.getOptimalCommunity().getAssignments()) System.out.print(m.getId() + " ");
        System.out.println();

        System.out.print("Wanted community: ");
        for(MemberDetailDto m: resultAnalysis3Dto.getWantedCommunity().getAssignments()) System.out.print(m.getId() + " ");
        System.out.println();
        /*
        System.out.println("Optimal community:");
        for(MemberDetailDto m: resultAnalysis3Dto.getOptimalCommunity().getAssignments()) {
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

        System.out.println("Default community:");
        for(MemberDetailDto m: resultAnalysis3Dto.getDefaultCommunity().getAssignments()) {
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
        System.out.println("Wanted community:");
        for(MemberDetailDto m: resultAnalysis3Dto.getWantedCommunity().getAssignments()) {
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
        */
        // System.out.println("KPI_1: " + resultAnalysis1Dto.getKpi1());
        // System.out.println("KPI_2: " + resultAnalysis1Dto.getKpi2());

        return ResponseEntity.ok(resultAnalysis3Dto);
    }
/*
    @GetMapping(value = "/start_2")
    public ResponseEntity<ResultAnalysis_2Dto> startSecondAnalysis(
            @RequestParam List<Long> memberIds) {

        try {
            // Recupera i membri completi dal DB
            List<MemberDetailDto> memberDetails = memberService.findAllById(memberIds);

            if (memberDetails.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            List<MemberDetailDto> averagedMembers = new ArrayList<>();

            for (MemberDetailDto member : memberDetails) {
                // Ottieni tutti i profili associati al membro
                List<ProfileDto> profiles = member.getProfiles().stream()
                        .map(profile -> modelMapper.map(profile, ProfileDto.class))
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
        return ResponseEntity.ok(result);
    }
*/

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("Error in startSecondAnalysis: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
