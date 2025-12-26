package com.vadosmik.checktogo_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // Wyłączamy CSRF, bo przeszkadza w testowaniu API przez Postman/Frontend
        .csrf(csrf -> csrf.disable())
        // Pozwalamy na dostęp do wszystkich adresów bez logowania Springa
        .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll()
        )
        // Wyłączamy domyślny formularz logowania
        .formLogin(form -> form.disable())
        // Wyłączamy logowanie przez wyskakujące okienko przeglądarki
        .httpBasic(basic -> basic.disable());

    return http.build();
  }
}