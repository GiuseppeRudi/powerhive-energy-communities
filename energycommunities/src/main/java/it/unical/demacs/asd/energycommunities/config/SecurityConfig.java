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
		http.csrf(csrf -> csrf.disable())
		.cors(cors -> cors.disable())
        .authorizeHttpRequests(authorize ->
            authorize.requestMatchers(
                "/v3/api-docs/**", 
                "/users/register",
                "/swagger-ui/**"
            ).permitAll()
            .anyRequest().authenticated()
        ).httpBasic(httpBasic -> httpBasic.init(http))

        .logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessHandler((request, response, authentication) -> {
                response.setStatus(200);
                response.getWriter().write("Successifully logout");
                response.getWriter().flush();
            })  
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID"));
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
