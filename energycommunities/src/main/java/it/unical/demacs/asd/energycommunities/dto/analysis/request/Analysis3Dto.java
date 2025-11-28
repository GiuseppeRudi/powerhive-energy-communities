package it.unical.demacs.asd.energycommunities.dto.analysis.request;

import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import lombok.Data;

import java.util.List;

@Data
public class Analysis3Dto {
    private List<MemberDetailDto> members;
    private List<Long> wantToAdd;
    private List<Long> wantToRemove;
}
