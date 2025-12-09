package it.unical.demacs.asd.energycommunities.data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "ongoing_analysis")
// @ToString(exclude = {"user", "members"})
@ToString(exclude = {"user", "batteries"})
@EqualsAndHashCode(exclude = {"user"})
public class OngoingAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "user_id", nullable = false)
    private User user;

    private int analysisType;

    private String status; // PENDING, RUNNING, FINISHED, ERROR

    private List<Long> memberIds = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "ongoing_analysis_batteries",
            joinColumns = @JoinColumn(name = "analysis_id"),
            inverseJoinColumns = @JoinColumn(name = "battery_id")
    )
    private List<Battery> batteries = new ArrayList<>();

    private List<Long> wantToAdd = new ArrayList<>();

    private List<Long> wantToRemove = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode resultModel;

    private LocalDateTime createdAt = LocalDateTime.now();
}

