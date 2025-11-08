package it.unical.demacs.asd.energycommunities.dto.user;

import it.unical.demacs.asd.energycommunities.dto.analysis.ResultAnalysis_1Dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoryDto {
    private Long userId;
    private Integer simulationNumber;
    private ResultAnalysis_1Dto analysisData;
}
