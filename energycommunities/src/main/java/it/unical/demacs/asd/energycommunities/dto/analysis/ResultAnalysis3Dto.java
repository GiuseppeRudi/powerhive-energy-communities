package it.unical.demacs.asd.energycommunities.dto.analysis;

import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ResultAnalysis3Dto {
    SingleAnalysis optimalCommunity;
    SingleAnalysis defaultCommunity;
    SingleAnalysis wantedCommunity;
}
