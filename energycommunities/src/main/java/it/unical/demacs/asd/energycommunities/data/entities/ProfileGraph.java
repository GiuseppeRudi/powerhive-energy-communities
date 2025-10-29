package it.unical.demacs.asd.energycommunities.data.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "profile_graphs")
public class ProfileGraph {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    @CollectionTable(name = "profile_graph_values", joinColumns = @JoinColumn(name = "profile_graph_id"))
    @OrderColumn(name = "hour")
    @Column(name = "energy", nullable = false)
    private List<Integer> graph = new ArrayList<>();
}
