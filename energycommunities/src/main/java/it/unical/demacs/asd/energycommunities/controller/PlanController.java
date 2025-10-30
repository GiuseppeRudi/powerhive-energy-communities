package it.unical.demacs.asd.energycommunities.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.naming.NameNotFoundException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
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

        planService.upload(file, ownerId);
        
        return ResponseEntity.ok("Data successifully saved");
    }

}
