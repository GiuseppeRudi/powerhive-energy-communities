package it.unical.demacs.asd.energycommunities.data.services.implementation;

import java.util.Collections;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService{
    private final UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDao.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username + "Not found"));
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            Collections.emptyList()
        );
    }

}
