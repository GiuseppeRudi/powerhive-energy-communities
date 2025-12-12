package it.unical.demacs.asd.energycommunities.dto.analysis.result;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
public class ResultAnalysis3Dto implements ResultAnalysis {
    SingleAnalysis optimalCommunity;
    SingleAnalysis defaultCommunity;
    SingleAnalysis wantedCommunity;
}
