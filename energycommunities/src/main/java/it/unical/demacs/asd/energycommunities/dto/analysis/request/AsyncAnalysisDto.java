package it.unical.demacs.asd.energycommunities.dto.analysis.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class AsyncAnalysisDto {
    List<Long> memberIds;
    int analysis;
    Long userId;
}
