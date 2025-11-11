package it.unical.demacs.asd.energycommunities.data.services;

import it.unical.demacs.asd.energycommunities.data.entities.Member;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;


import java.util.List;

public interface MemberService {

    List<MemberDetailDto> findAllById(List<Long> memberIds);

    List<Member> findMemberEntitiesById(List<Long> memberIds);
}



