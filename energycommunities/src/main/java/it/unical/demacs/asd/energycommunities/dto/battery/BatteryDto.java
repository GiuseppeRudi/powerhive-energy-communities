package it.unical.demacs.asd.energycommunities.dto.battery;

import it.unical.demacs.asd.energycommunities.dto.plan.PlanSummaryDto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BatteryDto {

    private Long id;

    private PlanSummaryDto plan;

    @NotNull
    private String model;

    @NotNull
    private Float capacity;

    @NotNull
    private Float price;

}
