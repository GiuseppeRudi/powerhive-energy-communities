package it.unical.demacs.asd.energycommunities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;

import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.data.services.implementation.UserServiceImpl;
import it.unical.demacs.asd.energycommunities.dto.user.UserDto;
import it.unical.demacs.asd.energycommunities.dto.user.UserRegistrationDto;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock private ModelMapper modelMapper;

    @Mock private UserDao userDao;

    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private UserServiceImpl userService;

    private User mockUser;
    private UserDto mockUserDto;
    private UserRegistrationDto userRegistrationDto;
    

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("example@example.test");
        mockUser.setUsername("test");
        mockUser.setPassword("encodedpass");

        mockUserDto = new UserDto();
        mockUserDto.setId(1L);
        mockUserDto.setEmail("example@example.test");
        mockUserDto.setUsername("test");

        userRegistrationDto = new UserRegistrationDto();
        userRegistrationDto.setEmail("example@example.test");
        userRegistrationDto.setUsername("test");
        userRegistrationDto.setPassword("plainpass");
    }

    @Test
    void testGetAll() {
        when(userDao.findAll()).thenReturn(List.of(mockUser));
        when(modelMapper.map(mockUser, UserDto.class)).thenReturn(mockUserDto);

        List<UserDto> result = userService.getAll();

        assertEquals(1, result.size());
        assertEquals("test", result.get(0).getUsername());
        verify(userDao).findAll();
    }

    @Test
    void testRegisterNewUser(){
        when(userDao.findByEmail(userRegistrationDto.getEmail())).thenReturn(Optional.empty());
        when(userDao.findByUsername(userRegistrationDto.getUsername())).thenReturn(Optional.empty());
        
        when(modelMapper.map(userRegistrationDto, User.class)).thenReturn(mockUser);
        when(passwordEncoder.encode("plainpass")).thenReturn("encodedpass");
        when(userDao.save(mockUser)).thenReturn(mockUser);
        when(modelMapper.map(mockUser, UserDto.class)).thenReturn(mockUserDto);

        UserDto result = userService.registerNewUser(userRegistrationDto);

        assertEquals("test", result.getUsername());
        verify(userDao).save(mockUser);
    }

    @Test
    void testLogin(){
        when(userDao.findByUsername("test")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("plainpass", "encodedpass")).thenReturn(true);
        when(modelMapper.map(mockUser, UserDto.class)).thenReturn(mockUserDto);

        UserDto result = userService.login("test", "plainpass");

        assertNotNull(result);
        assertEquals("test", result.getUsername());
    }



}
