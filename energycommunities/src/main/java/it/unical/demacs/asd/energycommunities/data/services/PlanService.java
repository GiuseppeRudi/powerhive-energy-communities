package it.unical.demacs.asd.energycommunities.data.services;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.naming.NameNotFoundException;

import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.ManualMemberDto;
import it.unical.demacs.asd.energycommunities.dto.user.PlanDto;
import org.springframework.web.multipart.MultipartFile;

public interface PlanService {
    PlanDto upload(MultipartFile file, Long ownerId) throws UnsupportedEncodingException, IOException, NameNotFoundException;

    PlanDto getPlanById(Long planId);

    MemberDetailDto getMember(Long planId, Long memberId);

    MemberDetailDto addMember(ManualMemberDto memberDto, Long ownerId) throws NameNotFoundException;

    void deleteMemberFromPlan(Long memberId, Long ownerId) throws NameNotFoundException;
}
