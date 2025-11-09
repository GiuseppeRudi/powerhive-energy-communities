package it.unical.demacs.asd.energycommunities.dto.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
public class UserDto {
    private Long id;

    private String username;
    
    private String email;

    private String plan_id;
}
