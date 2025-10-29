package it.unical.demacs.asd.energycommunities.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "profiles")
public class Profile {

    public enum ProfileType {
        PRODUCER, CONSUMER
    }

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
