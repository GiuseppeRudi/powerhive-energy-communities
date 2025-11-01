package it.unical.demacs.asd.energycommunities.dto;

import it.unical.demacs.asd.energycommunities.data.utils.MemberType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MemberSummaryDto {

    private Long id;
    private String fullName;
    private String email;
    private MemberType memberType;
}
