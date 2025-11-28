package it.unical.demacs.asd.energycommunities.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.naming.NameNotFoundException;

import it.unical.demacs.asd.energycommunities.data.utils.ProfileType;
import it.unical.demacs.asd.energycommunities.data.utils.ProfileUtils;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.ManualMemberDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;
import it.unical.demacs.asd.energycommunities.dto.plan.PlanDetailDto;
import it.unical.demacs.asd.energycommunities.dto.plan.PlanSummaryDto;
import org.modelmapper.ModelMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import it.unical.demacs.asd.energycommunities.data.services.PlanService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/plan")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class PlanController {
    private final PlanService planService;
    private final ModelMapper modelMapper;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@RequestPart("file") MultipartFile file, @RequestParam Long ownerId) throws UnsupportedEncodingException, IOException, NameNotFoundException{
        if(file.isEmpty()) 
            return ResponseEntity.badRequest().body("File is empty");

        PlanSummaryDto planSummaryDto = planService.upload(file, ownerId);
        
        return ResponseEntity.ok(planSummaryDto.getId().toString());
    }

    @PostMapping(value = "/addMember")
    public ResponseEntity<MemberDetailDto> addMember(
            @RequestBody ManualMemberDto memberDto,
            @RequestParam Long ownerId) throws NameNotFoundException
    {
        MemberDetailDto newMember = planService.addMember(memberDto, ownerId);
        return ResponseEntity.ok(newMember);
    }

    @GetMapping(value = "/summary/{id}")
    public ResponseEntity<PlanSummaryDto> getSummaryPlanById(@PathVariable Long id){
        PlanSummaryDto plan = planService.getSummaryPlanById(id);


        System.out.println(plan.toString());

        if(plan == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(plan);

    }

    @GetMapping(value = "/detail/{id}")
    public ResponseEntity<PlanDetailDto> getDetailPlanById(@PathVariable Long id){
        PlanDetailDto plan = planService.getDetailPlanById(id);

        List<MemberDetailDto> averagedMembers = new ArrayList<>();

        for (MemberDetailDto member : plan.getMembers()) {
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
            memberDto.setEmail(member.getEmail());
            memberDto.setMemberType(member.getMemberType());
            memberDto.setProfiles(
                    Stream.of(avgProducer, avgConsumer)
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList())
            );

            averagedMembers.add(memberDto);
        }

        plan.setMembers(averagedMembers);

        if(plan == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(plan);

    }

    @GetMapping(value = "/{plan_id}/{member_id}")
    public ResponseEntity<MemberDetailDto> getMember(@PathVariable Long plan_id, @PathVariable Long member_id){
        MemberDetailDto memberDetailDto = planService.getMember(plan_id,member_id);

        System.out.println(memberDetailDto.toString());

        if(memberDetailDto == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(memberDetailDto);
    }

    @DeleteMapping("/member/{memberId}")
    public ResponseEntity<Void> deleteMember(
            @PathVariable Long memberId,
            @RequestParam Long ownerId) throws NameNotFoundException {

        planService.deleteMemberFromPlan(memberId, ownerId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/full/{plan_id}")
    public ResponseEntity<PlanDetailDto> get_full_plan(@PathVariable Long plan_id){
        return ResponseEntity.ok(planService.getDetailPlanById(plan_id));
    }
}

