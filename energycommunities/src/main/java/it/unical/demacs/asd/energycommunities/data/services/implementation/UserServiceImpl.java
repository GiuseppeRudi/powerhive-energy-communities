package it.unical.demacs.asd.energycommunities.data.services.implementation;

import java.util.List;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.data.services.UserService;
import it.unical.demacs.asd.energycommunities.dto.UserDto;
import it.unical.demacs.asd.energycommunities.dto.UserRegistrationDto;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final ModelMapper modelMapper;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDto> getAll() {
        return userDao.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .toList();
    }

    @Override
    public UserDto registerNewUser(UserRegistrationDto registrationDto) {
        User user = modelMapper.map(registrationDto, User.class);

        String encodePassword = passwordEncoder.encode(registrationDto.getPassword());
        user.setPassword(encodePassword);

        User savedUser = userDao.save(user);

        return modelMapper.map(savedUser, UserDto.class);
    }

    public UserDto login(String username, String password) {
        User user = userDao.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username + " not found"));

        if (passwordEncoder.matches(password, user.getPassword())) {
            return modelMapper.map(user, UserDto.class);
        } else {
            return null; // o lancia un'eccezione
        }
    }

}
