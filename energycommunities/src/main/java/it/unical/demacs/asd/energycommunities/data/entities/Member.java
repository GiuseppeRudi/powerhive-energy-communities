package it.unical.demacs.asd.energycommunities.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "members")
public class Member {

    public enum MemberType {
        PRODUCER, CONSUMER, PROSUMER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;


    @Enumerated(EnumType.STRING)
    @Column
    private MemberType memberType;

    public MemberType getMemberType() {
        boolean hasProducer = profiles.stream().anyMatch(p -> p.getType() == Profile.ProfileType.PRODUCER);
        boolean hasConsumer = profiles.stream().anyMatch(p -> p.getType() == Profile.ProfileType.CONSUMER);

        if (hasProducer && hasConsumer) return MemberType.PROSUMER;
        else if (hasProducer) return MemberType.PRODUCER;
        else return MemberType.CONSUMER;
    }

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    @JsonIgnore
    private Plan plan;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Profile> profiles;
}
