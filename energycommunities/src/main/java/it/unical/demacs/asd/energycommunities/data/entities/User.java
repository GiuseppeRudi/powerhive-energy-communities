package it.unical.demacs.asd.energycommunities.data.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    private String username;

    @Email
    private String email;

    private String password;

    @OneToOne
    @JoinColumn(name = "plan_id")
    private Plan plan;

}
