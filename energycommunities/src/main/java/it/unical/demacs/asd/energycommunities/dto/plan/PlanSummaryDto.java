package it.unical.demacs.asd.energycommunities.dto.plan;

import it.unical.demacs.asd.energycommunities.dto.member.MemberSummaryDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class PlanSummaryDto {

    private Long id ;
    private List<MemberSummaryDto> members;
}
