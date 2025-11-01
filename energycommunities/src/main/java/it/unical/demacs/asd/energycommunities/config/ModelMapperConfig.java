package it.unical.demacs.asd.energycommunities.config;

import it.unical.demacs.asd.energycommunities.data.entities.Member;
import it.unical.demacs.asd.energycommunities.data.entities.Plan;
import it.unical.demacs.asd.energycommunities.data.entities.Profile;
import it.unical.demacs.asd.energycommunities.dto.*;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import it.unical.demacs.asd.energycommunities.data.entities.User;

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

        modelMapper.createTypeMap(Plan.class, PlanDto.class)
                        .setConverter( context -> {
                            Plan source = context.getSource();
                            PlanDto dto = new PlanDto();
                            dto.setId(source.getId());

                            if (source.getMembers() != null) {
                                dto.setMembers(source.getMembers().stream()
                                        .map(member -> modelMapper.map(member, MemberSummaryDto.class))
                                        .collect(Collectors.toList()));
                            }
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
                        .setConverter(context ->{
                            Member source = context.getSource();
                            MemberDetailDto dto = new MemberDetailDto();
                            dto.setId(source.getId());
                            dto.setFullName(source.getFullName());
                            dto.setEmail(source.getEmail());
                            dto.setMemberType(source.getMemberType());
                            dto.setProfiles(source.getProfiles().stream()
                                    .map(profile -> modelMapper.map(profile, ProfileDto.class))
                                    .toList());

                            return dto;
                        });

        modelMapper.createTypeMap(User.class, UserDto.class)
                .setConverter(context -> {
                    User source = context.getSource();
                    UserDto dto = new UserDto();
                    dto.setId(source.getId());
                    dto.setUsername(source.getUsername());
                    dto.setEmail(source.getEmail());
                    dto.setPlan_id(source.getPlan() != null ? source.getPlan().getId().toString() : null);
                    return dto;
                });


        return modelMapper;
    }
}
