package it.unical.demacs.asd.energycommunities.data.services;

import java.util.List;

import it.unical.demacs.asd.energycommunities.dto.UserDto;
import it.unical.demacs.asd.energycommunities.dto.UserRegistrationDto;

public interface UserService {
    List<UserDto> getAll();

    UserDto registerNewUser (UserRegistrationDto registrationDto);

    UserDto login(String username, String password);
}
