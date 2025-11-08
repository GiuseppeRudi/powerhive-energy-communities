package it.unical.demacs.asd.energycommunities.dto.member;

import it.unical.demacs.asd.energycommunities.data.utils.MemberType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class MemberDetailDto {

    private Long id;
    private String fullName;
    private String email;
    private MemberType memberType;
    private List<ProfileDto> profiles = new ArrayList<>();
}
