package it.unical.demacs.asd.energycommunities.dto.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
public class UserRegistrationDto {

    private String username;

    private String email;

    private String password;

    private String firstName;

    private String lastName;
}
