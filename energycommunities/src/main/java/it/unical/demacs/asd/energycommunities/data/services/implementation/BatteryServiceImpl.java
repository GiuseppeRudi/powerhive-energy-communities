package it.unical.demacs.asd.energycommunities.data.services.implementation;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import it.unical.demacs.asd.energycommunities.data.dao.BatteryDao;
import it.unical.demacs.asd.energycommunities.data.dao.PlanDao;
import it.unical.demacs.asd.energycommunities.data.entities.Battery;
import it.unical.demacs.asd.energycommunities.data.entities.Plan;
import it.unical.demacs.asd.energycommunities.data.services.BatteryService;
import it.unical.demacs.asd.energycommunities.dto.battery.BatteryDto;
import it.unical.demacs.asd.energycommunities.exception.ElementNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BatteryServiceImpl implements BatteryService{

    private final BatteryDao batteryDao;
    private final PlanDao planDao;

    private final ModelMapper modelMapper;

    @SuppressWarnings("null")
    @Override
    public void delete_battery(Long battery_id) {
        if(battery_id == null)
            throw new IllegalArgumentException("battery_id cannot be null");
        Battery battery = batteryDao.findById(battery_id).orElseThrow(() -> new ElementNotFoundException("no battery with id: " + battery_id));

        batteryDao.delete(battery);
    }

    @Override
    public BatteryDto add_battery(Long plan_id, BatteryDto battery) {
        if(plan_id == null)
            throw new IllegalArgumentException("plan_id cannot be null");
        Plan plan = planDao.findById(plan_id).orElseThrow(() -> new ElementNotFoundException("no plan with id: " + plan_id));

        Battery new_battery = new Battery();

        new_battery.setPlan(plan);
        new_battery.setCapacity(battery.getCapacity());
        new_battery.setModel(battery.getModel());
        new_battery.setPrice(battery.getPrice());

        plan.getBatteries().add(new_battery);
        
        return modelMapper.map(batteryDao.save(new_battery), BatteryDto.class);
    }

    @Override
    public List<BatteryDto> get_batteries_by_plan(Long plan_id) {
        if(plan_id == null)
            throw new IllegalArgumentException("plan_id cannot be null");
        Plan plan = planDao.findById(plan_id).orElseThrow(() -> new ElementNotFoundException("no plan with id: " + plan_id));

        return plan.getBatteries().stream().map(battery -> modelMapper.map(battery, BatteryDto.class)).toList();
    }

    @Override
    public BatteryDto get_battery(Long battery_id) {
        if(battery_id == null)
            throw new IllegalArgumentException("battery_id cannot be null");

        return modelMapper.map(
            batteryDao.findById(battery_id).orElseThrow(() -> new ElementNotFoundException("no battery with id: " + battery_id)),
            BatteryDto.class
        );
    }

}
