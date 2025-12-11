package it.unical.demacs.asd.energycommunities.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.unical.demacs.asd.energycommunities.data.utils.MemberType;
import it.unical.demacs.asd.energycommunities.data.utils.ProfileType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "members")
@ToString(exclude = {"plan", "profiles", "ongoingAnalysis"})
@EqualsAndHashCode(exclude = {"plan", "profiles", "ongoingAnalysis"})
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Email
    private String email;


    @Enumerated(EnumType.STRING)
    @Column
    private MemberType memberType;

    public MemberType getMemberType() {
        boolean hasProducer = profiles.stream().anyMatch(p -> p.getType() == ProfileType.PRODUCER);
        boolean hasConsumer = profiles.stream().anyMatch(p -> p.getType() == ProfileType.CONSUMER);

        if (hasProducer && hasConsumer) return MemberType.PROSUMER;
        else if (hasProducer) return MemberType.PRODUCER;
        else return MemberType.CONSUMER;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    @JsonIgnore
    private Plan plan;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Profile> profiles;
}
