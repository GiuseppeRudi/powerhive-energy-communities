package it.unical.demacs.asd.energycommunities.dto.history;


import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HistoryDetailDto {
    private Long id;
    private String name;
    private Integer analysisNumber;
    private JsonNode analysisData;
    private String createdAt;
}
