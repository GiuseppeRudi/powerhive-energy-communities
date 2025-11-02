package it.unical.demacs.asd.energycommunities.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.unical.demacs.asd.energycommunities.data.utils.ProfileType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@Table(name = "profiles")
@ToString(exclude = {"member"})
@EqualsAndHashCode(exclude = {"member"})
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    @JsonIgnore
    private Member member;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_graph_id", referencedColumnName = "id")
    private ProfileGraph profileGraph;

    @Enumerated(EnumType.STRING)
    @Column
    private ProfileType type;
}
