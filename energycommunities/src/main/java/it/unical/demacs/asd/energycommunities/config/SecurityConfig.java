package it.unical.demacs.asd.energycommunities.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain SecurityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable());
		http.cors(cors -> cors.disable());
        http.authorizeHttpRequests(authorize ->
            authorize.requestMatchers(
                "/v3/api-docs/**", 
                "/users/register",
                "/swagger-ui/**"
            ).permitAll()
            .anyRequest().authenticated()
        ).httpBasic(httpBasic -> httpBasic.init(http));

        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
