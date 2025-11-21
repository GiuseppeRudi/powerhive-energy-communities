package it.unical.demacs.asd.energycommunities.data.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "ongoing_analysis")
public class OngoingAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "user_id", nullable = false)
    private User user;

    private int analysisType;

    private String status; // PENDING, RUNNING, FINISHED, ERROR

    @Column(columnDefinition = "TEXT")
    private String resultModel;

    private LocalDateTime createdAt = LocalDateTime.now();
}

