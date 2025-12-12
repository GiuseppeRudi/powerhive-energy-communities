package it.unical.demacs.asd.energycommunities;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.unical.demacs.asd.energycommunities.clingo.ASPService;
import it.unical.demacs.asd.energycommunities.controller.AnalysisController;
import it.unical.demacs.asd.energycommunities.data.dao.BatteryDao;
import it.unical.demacs.asd.energycommunities.data.dao.MemberDao;
import it.unical.demacs.asd.energycommunities.data.dao.UserDao;
import it.unical.demacs.asd.energycommunities.data.services.BatteryService;
import it.unical.demacs.asd.energycommunities.data.services.MemberService;
import it.unical.demacs.asd.energycommunities.data.services.OngoingAnalysisService;
import it.unical.demacs.asd.energycommunities.dto.analysis.request.Analysis4Dto;
import it.unical.demacs.asd.energycommunities.dto.analysis.result.ResultAnalysis4Dto;
import it.unical.demacs.asd.energycommunities.dto.battery.BatteryDto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
@WebMvcTest(AnalysisController.class)
public class AnalysisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean private ASPService aspService;
    @MockitoBean private MemberService memberService;
    @MockitoBean private BatteryService batteryService;
    @MockitoBean private ModelMapper modelMapper;
    @MockitoBean private OngoingAnalysisService ongoingAnalysisService;
    @MockitoBean private UserDao userDao;
    @MockitoBean private MemberDao memberDao;
    @MockitoBean private BatteryDao batteryDao;

    @Test
    @WithMockUser(username = "admin")
    void startFourthAnalysis_ShouldReturnOk_WhenRequestIsValid() throws Exception {

        Analysis4Dto request = new Analysis4Dto();
        request.setBudget(5000);

        MemberDetailDto member = new MemberDetailDto();
        member.setId(1L);
        member.setFullName("Mario Rossi");
        request.setMembers(Collections.singletonList(member));

        BatteryDto battery = new BatteryDto();
        battery.setId(100L);
        battery.setPrice(2000);
        battery.setCapacity(10);
        request.setBatteries(Collections.singletonList(battery));

        ResultAnalysis4Dto mockResponse = new ResultAnalysis4Dto();

        List<BatteryDto> assignedBatteries = new ArrayList<>();
        assignedBatteries.add(battery);
        mockResponse.setBatteries(assignedBatteries);

        given(aspService.generateChooseBatteries(anyList(), anyList(), anyInt()))
                .willReturn(mockResponse);

        mockMvc.perform(post("/analysis/start_4")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())

                .andExpect(jsonPath("$.batteries").isArray())
                .andExpect(jsonPath("$.batteries[0].id").value(100));
    }
}