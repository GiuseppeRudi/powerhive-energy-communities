package it.unical.demacs.asd.energycommunities.dto.member;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class MemberDto {
    private Long memberId;
    private List<ProfileDto> profileIds = new ArrayList<>();
}
