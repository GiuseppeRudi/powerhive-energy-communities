package it.unical.demacs.asd.energycommunities.dto;

import it.unical.demacs.asd.energycommunities.data.utils.ProfileType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ProfileDto {
    private Long id;
    private ProfileType profileType;
    private List<Integer> graph;
}
