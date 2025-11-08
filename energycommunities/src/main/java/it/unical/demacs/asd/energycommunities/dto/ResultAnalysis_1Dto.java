package it.unical.demacs.asd.energycommunities.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ResultAnalysis_1Dto {
    private List<MemberDetailDto> assignments;
    List<Double> kpi1;
    List<Double> kpi2;
    List<Double> totalConsumption;
    List<Double> totalProduction;
}
