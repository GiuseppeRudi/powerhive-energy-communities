package it.unical.demacs.asd.energycommunities.dto.plan;

import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class PlanDetailDto {

    private Long id ;
    private List<MemberDetailDto> members;
}
