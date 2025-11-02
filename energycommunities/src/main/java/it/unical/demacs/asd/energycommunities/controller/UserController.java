package it.unical.demacs.asd.energycommunities.controller;

import java.util.List;

import it.unical.demacs.asd.energycommunities.dto.LoginDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import it.unical.demacs.asd.energycommunities.data.services.UserService;
import it.unical.demacs.asd.energycommunities.dto.UserDto;
import it.unical.demacs.asd.energycommunities.dto.UserRegistrationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserDto>> getAll(){
        return ResponseEntity.ok(userService.getAll());
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerNewUser(@RequestBody UserRegistrationDto registrationDto) {
        UserDto newUser = userService.registerNewUser(registrationDto);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }


    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody LoginDto loginDto, HttpServletRequest request) {
        UserDto user = userService.login(loginDto.getUsername(), loginDto.getPassword());

        if (user != null) {
            request.getSession(true);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


}
