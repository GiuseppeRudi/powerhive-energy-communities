package it.unical.demacs.asd.energycommunities.dto.history;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HistorySummaryDto {
    private Long id;
    private String name;
    private Integer analysisNumber;
    private String createdAt;
}
