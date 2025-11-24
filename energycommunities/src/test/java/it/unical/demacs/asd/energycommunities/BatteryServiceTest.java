package it.unical.demacs.asd.energycommunities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import it.unical.demacs.asd.energycommunities.data.dao.BatteryDao;
import it.unical.demacs.asd.energycommunities.data.dao.PlanDao;
import it.unical.demacs.asd.energycommunities.data.entities.Battery;
import it.unical.demacs.asd.energycommunities.data.entities.Plan;
import it.unical.demacs.asd.energycommunities.data.services.implementation.BatteryServiceImpl;
import it.unical.demacs.asd.energycommunities.dto.battery.BatteryDto;
import it.unical.demacs.asd.energycommunities.exception.ElementNotFoundException;

@ExtendWith(MockitoExtension.class)
public class BatteryServiceTest {

    @Mock
    private BatteryDao batteryDao;

    @Mock
    private PlanDao planDao;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private BatteryServiceImpl batteryService;

    private Battery mockBattery;
    private BatteryDto mockBatteryDto;
    private Plan mockPlan;

    @BeforeEach
    void setUp() {
        // Setup Plan
        mockPlan = new Plan();
        mockPlan.setId(1L);
        // È fondamentale inizializzare la lista per evitare NullPointerException 
        // quando il service esegue plan.getBatteries().add(...)
        mockPlan.setBatteries(new ArrayList<>()); 

        // Setup Battery Entity
        mockBattery = new Battery();
        mockBattery.setId(100L);
        mockBattery.setModel("Tesla Powerwall");
        mockBattery.setCapacity(13);
        mockBattery.setPrice(8000);
        mockBattery.setPlan(mockPlan);

        // Aggiungiamo la batteria al piano per i test di recupero liste
        mockPlan.getBatteries().add(mockBattery);

        // Setup Battery DTO
        mockBatteryDto = new BatteryDto();
        mockBatteryDto.setId(100L);
        mockBatteryDto.setModel("Tesla Powerwall");
        mockBatteryDto.setCapacity(13);
        mockBatteryDto.setPrice(8000);
    }

    @Test
    void testGetBattery() {
        when(batteryDao.findById(100L)).thenReturn(Optional.of(mockBattery));
        when(modelMapper.map(mockBattery, BatteryDto.class)).thenReturn(mockBatteryDto);

        BatteryDto result = batteryService.get_battery(100L);

        assertNotNull(result);
        assertEquals("Tesla Powerwall", result.getModel());
        assertEquals(100L, result.getId());
        verify(batteryDao).findById(100L);
    }

    @Test
    void testGetBatteryNotFound() {
        when(batteryDao.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ElementNotFoundException.class, () -> {
            batteryService.get_battery(999L);
        });
    }

    @SuppressWarnings("null")
    @Test
    void testAddBattery() {
        // DTO in input (senza ID, simula una nuova creazione)
        BatteryDto inputDto = new BatteryDto();
        inputDto.setModel("Tesla Powerwall");
        inputDto.setCapacity(13);
        inputDto.setPrice(8000);

        when(planDao.findById(1L)).thenReturn(Optional.of(mockPlan));
        // Quando salviamo una qualsiasi batteria, ritorniamo quella mockata completa di ID
        when(batteryDao.save(any(Battery.class))).thenReturn(mockBattery);
        when(modelMapper.map(mockBattery, BatteryDto.class)).thenReturn(mockBatteryDto);

        BatteryDto result = batteryService.add_battery(1L, inputDto);

        assertNotNull(result);
        assertEquals("Tesla Powerwall", result.getModel());
        // Verifichiamo che il piano sia stato recuperato e la batteria salvata
        verify(planDao).findById(1L);
        verify(batteryDao).save(any(Battery.class));
    }

    @SuppressWarnings("null")
    @Test
    void testDeleteBattery() {
        when(batteryDao.findById(100L)).thenReturn(Optional.of(mockBattery));

        batteryService.delete_battery(100L);

        verify(batteryDao).findById(100L);
        verify(batteryDao).delete(mockBattery);
    }

    @Test
    void testGetBatteriesByPlan() {
        when(planDao.findById(1L)).thenReturn(Optional.of(mockPlan));
        when(modelMapper.map(mockBattery, BatteryDto.class)).thenReturn(mockBatteryDto);

        List<BatteryDto> result = batteryService.get_batteries_by_plan(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Tesla Powerwall", result.get(0).getModel());
        verify(planDao).findById(1L);
    }
}