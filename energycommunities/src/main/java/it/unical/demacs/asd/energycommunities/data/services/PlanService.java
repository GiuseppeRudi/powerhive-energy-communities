package it.unical.demacs.asd.energycommunities.data.services;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.naming.NameNotFoundException;

import it.unical.demacs.asd.energycommunities.data.entities.Plan;
import it.unical.demacs.asd.energycommunities.dto.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.PlanDto;
import org.springframework.web.multipart.MultipartFile;

public interface PlanService {
    void upload(MultipartFile file, Long ownerId) throws UnsupportedEncodingException, IOException, NameNotFoundException;

    PlanDto getPlanById(Long planId);

    MemberDetailDto getMember(Long planId, Long memberId);
}
