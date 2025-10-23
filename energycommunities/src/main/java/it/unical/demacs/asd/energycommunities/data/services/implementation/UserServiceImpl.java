package it.unical.demacs.asd.energycommunities.data.services.implementation;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.services.UserService;
import it.unical.demacs.asd.energycommunities.dto.UserDto;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final ModelMapper modelMapper;
    private final UserDao userDao;

    @Override
    public List<UserDto> getAll() {
        return userDao.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .toList();
    }
}
