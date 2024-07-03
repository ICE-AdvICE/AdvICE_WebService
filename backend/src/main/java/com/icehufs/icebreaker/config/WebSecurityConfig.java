package com.icehufs.icebreaker.config;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.icehufs.icebreaker.filter.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configurable
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig { //filter를 사용할 . 수있도록 config
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    protected SecurityFilterChain configure(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
                .cors().and()
                .csrf().disable()
                .httpBasic().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                .antMatchers("/", "/api/**").permitAll() //권한이 필요없는 API 설정
                .anyRequest().authenticated().and()
                .exceptionHandling().authenticationEntryPoint(new FailedAuthenticationEntryPoint());

        httpSecurity.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();

    }

}

class FailedAuthenticationEntryPoint implements AuthenticationEntryPoint{ //인증 실패할 경우 처리

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"code\": \"AF\", \"message\": \"Authorization Failed.\"}");
    }
    
}
