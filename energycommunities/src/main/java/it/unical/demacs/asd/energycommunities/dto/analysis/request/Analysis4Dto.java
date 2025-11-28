package it.unical.demacs.asd.energycommunities.dto.analysis.request;

import it.unical.demacs.asd.energycommunities.dto.battery.BatteryDto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import lombok.Data;

import java.util.List;

@Data
public class Analysis4Dto {
    private List<MemberDetailDto> members;
    private List<BatteryDto> batteries;
    private int budget;
}
