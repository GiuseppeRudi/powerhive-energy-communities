package it.unical.demacs.asd.energycommunities.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import it.unical.demacs.asd.energycommunities.data.entities.User;
import it.unical.demacs.asd.energycommunities.dto.UserDto;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper getModelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);


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
