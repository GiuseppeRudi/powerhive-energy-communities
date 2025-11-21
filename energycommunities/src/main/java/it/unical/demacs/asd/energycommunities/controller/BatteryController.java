package it.unical.demacs.asd.energycommunities.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.unical.demacs.asd.energycommunities.data.services.BatteryService;
import it.unical.demacs.asd.energycommunities.dto.battery.BatteryDto;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/battery")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequiredArgsConstructor
public class BatteryController {

    private final BatteryService batteryService;

    @PostMapping("/plan/{plan_id}")
    public ResponseEntity<BatteryDto> add_battery(@PathVariable Long plan_id, BatteryDto battery){
        return ResponseEntity.ok(batteryService.add_battery(plan_id, battery));
    }

    @GetMapping("/{battery_id}")
    public ResponseEntity<BatteryDto> get_battery(@PathVariable Long battery_id){
        return ResponseEntity.ok(batteryService.get_battery(battery_id));
    }

    @DeleteMapping("/{battery_id}")
    public ResponseEntity<Void> delete_battery(@PathVariable Long battery_id){
        batteryService.delete_battery(battery_id);
        return ResponseEntity.ok().build();
    }
 
    @GetMapping("/all/{plan_id}")
    public ResponseEntity<List<BatteryDto>> get_batteries_by_plan(@PathVariable Long plan_id){
        return ResponseEntity.ok(batteryService.get_batteries_by_plan(plan_id));
    }
}
