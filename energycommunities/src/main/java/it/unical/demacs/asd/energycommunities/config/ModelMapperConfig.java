package it.unical.demacs.asd.energycommunities.config;

import it.unical.demacs.asd.energycommunities.data.entities.*;
import it.unical.demacs.asd.energycommunities.dto.analysis.result.OngoingAnalysisDto;
import it.unical.demacs.asd.energycommunities.dto.battery.BatteryDto;
import it.unical.demacs.asd.energycommunities.dto.history.HistoryDetailDto;
import it.unical.demacs.asd.energycommunities.dto.history.HistorySummaryDto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberDetailDto;
import it.unical.demacs.asd.energycommunities.dto.member.MemberSummaryDto;
import it.unical.demacs.asd.energycommunities.dto.member.ProfileDto;
import it.unical.demacs.asd.energycommunities.dto.plan.PlanDetailDto;
import it.unical.demacs.asd.energycommunities.dto.plan.PlanSummaryDto;
import it.unical.demacs.asd.energycommunities.dto.user.UserDto;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper getModelMapper() {

        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        modelMapper.createTypeMap(Member.class, MemberSummaryDto.class)
                .setConverter(context -> {
                    Member source = context.getSource();
                    MemberSummaryDto dto = new MemberSummaryDto();
                    dto.setId(source.getId());
                    dto.setFullName(source.getFullName());
                    dto.setEmail(source.getEmail());
                    dto.setEmail(source.getEmail());
                    dto.setMemberType(source.getMemberType());
                    return dto;
                });

        modelMapper.createTypeMap(Plan.class, PlanSummaryDto.class)
                .setConverter(context -> {
                    Plan source = context.getSource();
                    PlanSummaryDto dto = new PlanSummaryDto();
                    dto.setId(source.getId());

                    if (source.getMembers() != null) {
                        dto.setMembers(source.getMembers().stream()
                                .map(member -> modelMapper.map(member, MemberSummaryDto.class))
                                .collect(Collectors.toList()));
                    }
                    return dto;
                });

        modelMapper.createTypeMap(Plan.class, PlanDetailDto.class)
                .setConverter(context -> {
                    Plan source = context.getSource();
                    PlanDetailDto dto = new PlanDetailDto();
                    dto.setId(source.getId());

                    if (source.getMembers() != null) {
                        dto.setMembers(source.getMembers().stream()
                                .map(member -> modelMapper.map(member, MemberDetailDto.class))
                                .collect(Collectors.toList()));
                    }
                    return dto;
                });

        modelMapper.createTypeMap(History.class, HistoryDetailDto.class)
                .setConverter(context -> {
                    History source = context.getSource();
                    HistoryDetailDto dto = new HistoryDetailDto();
                    dto.setId(source.getId());
                    dto.setName(source.getName());
                    dto.setAnalysisData(source.getAnalysisData());
                    dto.setAnalysisNumber(source.getAnalysisNumber());
                    dto.setCreatedAt(source.getCreatedAt().toString());
                    return dto;
                });

        modelMapper.createTypeMap(History.class, HistorySummaryDto.class)
                .setConverter(context -> {
                    History source = context.getSource();
                    HistorySummaryDto dto = new HistorySummaryDto();
                    dto.setId(source.getId());
                    dto.setName(source.getName());
                    dto.setAnalysisNumber(source.getAnalysisNumber());
                    dto.setCreatedAt(source.getCreatedAt().toString());
                    return dto;
                });

        modelMapper.createTypeMap(OngoingAnalysis.class, OngoingAnalysisDto.class)
                .setConverter(context -> {
                    OngoingAnalysis source = context.getSource();
                    OngoingAnalysisDto dto = new OngoingAnalysisDto();
                    dto.setId(source.getId());
                    dto.setAnalysisType(source.getAnalysisType());
                    dto.setStatus(source.getStatus());
                    dto.setResultModel(source.getResultModel());
                    dto.setNumMembers(source.getMemberIds().size());
                    dto.setNumBatteries(source.getBatteries().size());
                    dto.setUserId(source.getUser().getId());
                    dto.setCreatedAt(LocalDateTime.parse(source.getCreatedAt().toString()));
                    return dto;
                });

        modelMapper.createTypeMap(Profile.class, ProfileDto.class)
                .setConverter(context -> {
                    Profile source = context.getSource();
                    ProfileDto dto = new ProfileDto();
                    dto.setId(source.getId());
                    dto.setProfileType(source.getType());
                    dto.setGraph(source.getProfileGraph().getGraph());
                    return dto;
                });

        modelMapper.createTypeMap(Member.class, MemberDetailDto.class)
                .setConverter(context -> {
                    Member source = context.getSource();
                    MemberDetailDto dto = new MemberDetailDto();
                    dto.setId(source.getId());
                    dto.setFullName(source.getFullName());
                    dto.setEmail(source.getEmail());
                    dto.setMemberType(source.getMemberType());
                    dto.setProfiles(source.getProfiles().stream()
                            .map(profile -> modelMapper.map(profile, ProfileDto.class))
                            .toList());
                    dto.setPlanId(source.getPlan().getId());

                    return dto;
                });

        modelMapper.createTypeMap(User.class, UserDto.class)
                .setConverter(context -> {
                    User source = context.getSource();
                    UserDto dto = new UserDto();
                    dto.setId(source.getId());
                    dto.setUsername(source.getUsername());
                    dto.setEmail(source.getEmail());

                    if (source.getPlan() != null)
                        dto.setPlan_id(source.getPlan().getId());

                    System.out.println(source);
                    System.out.println(dto);
                    
                    return dto;
                });

        modelMapper.createTypeMap(Battery.class, BatteryDto.class)
                .setConverter(context -> {
                    Battery source = context.getSource();
                    BatteryDto dto = new BatteryDto();
                    dto.setId(source.getId());
                    dto.setPlan(modelMapper.map(source.getPlan(), PlanSummaryDto.class));
                    dto.setModel(source.getModel());
                    dto.setCapacity(source.getCapacity());
                    dto.setPrice(source.getPrice());
                    return dto;
                });

        return modelMapper;
    }
}
