package com.icehufs.icebreaker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer{ //cors에 대한 정책설정

    @Override
    public void addCorsMappings (CorsRegistry corsRegistry){
        corsRegistry
            .addMapping("/**")
            .allowedMethods("*")
            .allowedOrigins("*");
    }
    
}
