package it.unical.demacs.asd.energycommunities.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class BestModelDto {
    private List<MemberDetailDto> assignments;
    List<Integer> kpi1;
    List<Integer> kpi2;
}
