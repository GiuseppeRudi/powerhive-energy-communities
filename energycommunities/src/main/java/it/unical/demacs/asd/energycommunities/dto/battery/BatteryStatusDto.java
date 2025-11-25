package it.unical.demacs.asd.energycommunities.dto.battery;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BatteryStatusDto {
    private long memberId;
    private long batteryId;
    private int[] energyByHour = new int[24];
}
