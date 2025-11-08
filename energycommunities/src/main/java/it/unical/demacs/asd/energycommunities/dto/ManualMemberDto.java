package it.unical.demacs.asd.energycommunities.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ManualMemberDto {

    private String fullName;
    private String email;
    private String category;
    // Lista dei 24 valori energetici
    private List<Integer> energyValues;
}