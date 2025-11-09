package it.unical.demacs.asd.energycommunities.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.naming.NameNotFoundException;

import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.user.PlanDto;
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

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@RequestPart("file") MultipartFile file, @RequestParam Long ownerId) throws UnsupportedEncodingException, IOException, NameNotFoundException{
        if(file.isEmpty()) 
            return ResponseEntity.badRequest().body("File is empty");

        PlanDto planDto = planService.upload(file, ownerId);
        
        return ResponseEntity.ok(planDto.getId().toString());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<PlanDto> getPlanById(@PathVariable Long id){
        PlanDto plan = planService.getPlanById(id);


        System.out.println(plan.toString());

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
}

