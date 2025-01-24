package com.icehufs.icebreaker.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.icehufs.icebreaker.domain.auth.domain.entity.Authority;
import com.icehufs.icebreaker.provider.JwtProvider;
import com.icehufs.icebreaker.domain.auth.repostiory.AuthorityRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{ 
    //JwtAuthenticationFilter가 conroller에 가기전 단계로 여기서 jwt의 검증이 되고, 검증된 jwt의학번과 권한을 나머지 request정보와 같이 Context에 저장해서 controller에게 넘겨줌

    private final JwtProvider jwtProvider;
    private final AuthorityRepository authorityRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try{
            String token = parseBearerToken(request); //parseBearerToken함수로부터 인증된 토근을 받기
        if(token == null){ //parseBearerToken에서 토큰이 인증 실패되었다면 다음 필터에게 넘기기
            filterChain.doFilter(request, response);
            return;
        }
        
        String email = jwtProvider.validate(token);
        if (email == null) {
            setJsonResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "NU", "This user does not exist.");
            return;
        }


        List<GrantedAuthority> authorities = new ArrayList<>(); //권한을 저장할 리스트 선언

        Authority authority = authorityRepository.findByEmail(email);

        authorities.add(new SimpleGrantedAuthority("ROLE_USER")); //기본 사용자 권한 부여

        if(!"NULL".equals(authority.getRoleAdmin1())){
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN1")); //익명게시판 운영자 권한 부여
        }

        if(!"NULL".equals(authority.getRoleAdminC1())){
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMINC1"));//코딩존 과목1 조교 권한 부여
        }

        if(!"NULL".equals(authority.getRoleAdminC2())){
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMINC2"));//코딩존 과목2 조교 권한 부여
        }

        if(!"NULL".equals(authority.getRoleAdmin())){
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));//'ICEbreaker' 코딩존 수업 등록 및 권한 부여 가능한 권한(과사조교) 부여
        }


        AbstractAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(email, null, authorities); //Context를 생성하기 위해 authenticationToken에 아이디,비번,권한을 매개변수로 받음
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); //authenticationToken에 request의 디테일한 정보 추가

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext(); //Context 선언
        securityContext.setAuthentication(authenticationToken); //securityContext로 Context에 초기화

        SecurityContextHolder.setContext(securityContext); //Context를 외부에 사용할수있도록 설정

        } catch (Exception exception){
            exception.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

    private void setJsonResponse(HttpServletResponse response, int status, String code, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format("{\"code\":\"%s\", \"message\":\"%s\"}", code, message));
    }

    private String parseBearerToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }
        return null;
    }
    
}
