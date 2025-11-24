package it.unical.demacs.asd.energycommunities.dto.analysis.result;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class OngoingAnalysisDto {
    private Long id;
    private Long userId;
    private int analysisType;
    private String status; // PENDING, RUNNING, FINISHED, ERROR
    private String resultModel;
    private int numMembers;
    private LocalDateTime createdAt = LocalDateTime.now();
}

