package it.unical.demacs.asd.energycommunities.data.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "plans")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "plan")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL)
    private List<Member> members;
}
