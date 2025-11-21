package it.unical.demacs.asd.energycommunities.data.services.implementation;

import it.unical.demacs.asd.energycommunities.data.dao.MemberDao;
import it.unical.demacs.asd.energycommunities.data.services.MemberService;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final ModelMapper modelMapper;
    private final MemberDao memberDao;

    @SuppressWarnings("null")
    public List<MemberDetailDto> findAllById(List<Long> memberIds) {
        return memberDao.findAllById(memberIds)
                .stream()
                .map(member -> modelMapper.map(member, MemberDetailDto.class))
                .toList();
    }

}

