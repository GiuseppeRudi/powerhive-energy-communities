package it.unical.demacs.asd.energycommunities.dto.analysis;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaveAnalysisRequestDto {
    private Long userId;

    private Integer analysisNumber;
    private String analysisName;
    private JsonNode analysisData;
}
