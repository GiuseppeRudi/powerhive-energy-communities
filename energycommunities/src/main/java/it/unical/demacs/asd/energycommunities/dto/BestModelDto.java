package it.unical.demacs.asd.energycommunities.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class BestModelDto {
    private List<MemberDetailDto> assignments;
    private long[] cost;
}
