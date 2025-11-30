package it.unical.demacs.asd.energycommunities.data.services;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.naming.NameNotFoundException;

import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.ManualMemberDto;
import it.unical.demacs.asd.energycommunities.dto.plan.PlanDetailDto;
import it.unical.demacs.asd.energycommunities.dto.plan.PlanSummaryDto;
import org.springframework.web.multipart.MultipartFile;

public interface PlanService {
    PlanSummaryDto upload(MultipartFile file, Long ownerId) throws UnsupportedEncodingException, IOException, NameNotFoundException;

    PlanSummaryDto getSummaryPlanById(Long planId);

    PlanDetailDto getDetailPlanById(Long planId);

    MemberDetailDto getMember(Long planId, Long memberId);

    MemberDetailDto addMember(ManualMemberDto memberDto, Long ownerId) throws NameNotFoundException;

    void deleteMemberFromPlan(Long memberId, Long ownerId) throws NameNotFoundException;

    MemberDetailDto add_new_member(MemberDetailDto memberDetailDto, Long ownerId);
}
