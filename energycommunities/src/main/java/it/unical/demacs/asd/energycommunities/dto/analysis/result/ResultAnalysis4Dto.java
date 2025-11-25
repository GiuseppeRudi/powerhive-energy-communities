package it.unical.demacs.asd.energycommunities.dto.analysis.result;


import it.unical.demacs.asd.energycommunities.dto.battery.BatteryDto;
import it.unical.demacs.asd.energycommunities.dto.battery.BatteryStatusDto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class ResultAnalysis4Dto {
    List<Double> kpi1;
    List<Double> kpi2;
    List<Double> totalConsumption;
    List<Double> totalProduction;
    Map<Long,Long> assignment;
    List<BatteryStatusDto> batteryStatus;
}
