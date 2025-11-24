package it.unical.demacs.asd.energycommunities.dto.analysis.result;

import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ResultAnalysis2Dto {
    private List<MemberDetailDto> assignments;
    List<Double> kpi1;
    List<Double> kpi2;
    List<Double> totalConsumption;
    List<Double> totalProduction;
}
