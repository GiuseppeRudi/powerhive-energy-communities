package it.unical.demacs.asd.energycommunities.dto.analysis.request;

import com.fasterxml.jackson.databind.JsonNode;
import it.unical.demacs.asd.energycommunities.dto.battery.BatteryDto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class AsyncAnalysisDto {
    List<Long> memberIds;
    List<Long> batteries;
    Integer budget;
    List<Long> wantToAdd;
    List<Long> wantToRemove;
    int dim;
    int analysis;
    Long userId;
    JsonNode result;
}
