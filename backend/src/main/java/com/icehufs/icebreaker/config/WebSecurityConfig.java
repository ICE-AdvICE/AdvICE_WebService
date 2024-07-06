package com.icehufs.icebreaker.config;

import java.io.IOException;

import javax.servlet.ServletException;

import static org.springframework.security.config.Customizer.withDefaults;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.icehufs.icebreaker.filter.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configurable
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
            .cors(cors -> cors
                .configurationSource(corsConfigurationSource())
            )
            .csrf(CsrfConfigurer::disable)
            .httpBasic(HttpBasicConfigurer::disable)
            .sessionManagement(sessionManagement -> sessionManagement 
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeRequests(request -> request
                .antMatchers("/api/v1/**").permitAll()
                .mvcMatchers("/api/admin1/**").hasRole("ADMIN1")
                .mvcMatchers("/api/admin2/**").hasRole("ADMIN2")
                .anyRequest().authenticated()
            )
            .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint(new FailedAuthenticationEntryPoint()) //인증 실패 예외 처리
                .accessDeniedHandler(new CustomAccessDeniedHandler())  // 권한 없음 예외 처리
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    protected CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", corsConfiguration);

        return source;
    }
}

class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint { //인증 실패 예외 처리 함수

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"code\": \"AF\", \"message\": \"No Permission.\"}");
    }
    
}

class CustomAccessDeniedHandler implements AccessDeniedHandler { // 권한 없음 예외 처리 함수

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
            org.springframework.security.access.AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write("{\"code\": \"AF\", \"message\": \"No Permission.\"}");
    }
}
