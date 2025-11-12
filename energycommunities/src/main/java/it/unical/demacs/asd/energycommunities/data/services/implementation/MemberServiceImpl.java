package it.unical.demacs.asd.energycommunities.data.services.implementation;

import it.unical.demacs.asd.energycommunities.data.dao.MemberDao;
import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.entities.Member;
import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.data.services.MemberService;
import it.unical.demacs.asd.energycommunities.data.services.UserService;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.user.UserDto;
import it.unical.demacs.asd.energycommunities.dto.user.UserRegistrationDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final ModelMapper modelMapper;
    private final MemberDao memberDao;

    public List<MemberDetailDto> findAllById(List<Long> memberIds) {
        return memberDao.findAllById(memberIds)
                .stream()
                .map(member -> modelMapper.map(member, MemberDetailDto.class))
                .toList();
    }

    public List<Member> findMemberEntitiesById(List<Long> memberIds) {
        return memberDao.findAllById(memberIds);
    }


}

