package it.unical.demacs.asd.energycommunities.dto.analysis;

import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberSummaryDto;
import lombok.Data;

import java.util.List;

@Data
public class Analysis2Dto {
    private List<MemberDetailDto> members;
    private int dimCommunity;
}
