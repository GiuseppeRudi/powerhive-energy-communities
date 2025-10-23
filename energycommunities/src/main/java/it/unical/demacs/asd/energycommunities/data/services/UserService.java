package it.unical.demacs.asd.energycommunities.data.services;

import java.util.List;

import it.unical.demacs.asd.energycommunities.dto.UserDto;

public interface UserService {
    List<UserDto> getAll();
}
