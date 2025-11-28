package it.unical.demacs.asd.energycommunities.dto.analysis.result;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResultAnalysis3Dto {
    SingleAnalysis optimalCommunity;
    SingleAnalysis defaultCommunity;
    SingleAnalysis wantedCommunity;
}
