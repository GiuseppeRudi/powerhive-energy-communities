package it.unical.demacs.asd.energycommunities.dto.user;

import it.unical.demacs.asd.energycommunities.dto.member.MemberSummaryDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class PlanDto {

    private Long id ;
    private List<MemberSummaryDto> members;
}
