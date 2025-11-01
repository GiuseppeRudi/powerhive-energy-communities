package it.unical.demacs.asd.energycommunities.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
public class ProfileDto {
    private Long profileId;
    private Map<Integer,Integer> hourlyValues;
}
