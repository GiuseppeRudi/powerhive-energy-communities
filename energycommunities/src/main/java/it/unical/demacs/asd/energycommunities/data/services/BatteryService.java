package it.unical.demacs.asd.energycommunities.data.services;

import java.util.List;

import it.unical.demacs.asd.energycommunities.dto.battery.BatteryDto;

public interface BatteryService {

    List<BatteryDto> get_batteries_by_plan(Long plan_id);

    BatteryDto get_battery(Long battery_id);

    void delete_battery(Long battery_id);

    BatteryDto add_battery(Long plan_id, BatteryDto battery);
}
