package com.vadosmik.checktogo_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins(
            "http://localhost:5173", // Vite dev
            "http://localhost:80", // Port 80 z jawnym numerem
            "http://localhost" // Standardowy localhost (port 80 ukryty)
        )
        .allowedMethods("GET", "POST", "PUT", "DELETE")
        .allowedHeaders("*")
        .allowCredentials(true);
  }
}