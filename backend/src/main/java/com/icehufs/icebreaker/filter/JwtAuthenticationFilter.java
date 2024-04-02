package com.icehufs.icebreaker.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.icehufs.icebreaker.provider.JwtProvider;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{ //filter가 conroller에 가기전 단계로 여기서 jwt의 검증이 됨, 학번을 Context에 저장해서 controller에게 넘겨줌

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try{
            String token = parseBearerToken(request); //parseBearerToken함수로부터 인증된 토근을 받기
        if(token == null){ //parseBearerToken에서 토큰이 인증 실패되었다면 다음 필터에게 넘기기
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtProvider.validate(token); //validate과정에서 기간이 만료 되었거나, secretKey가 안 맞으면 null
        if (email == null){
            filterChain.doFilter(request, response);
            return;
        }

        AbstractAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(email, null, AuthorityUtils.NO_AUTHORITIES); //Context를 생성하기 위해 authenticationToken에 아이디,비번,권한을 매개변수로 받음
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); //authenticationToken에 request의 디테일한 정보 추가

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext(); //Context 선언
        securityContext.setAuthentication(authenticationToken); //securityContext로 Context에 초기화

        SecurityContextHolder.setContext(securityContext); //Context를 외부에 사용할수있도록 설정

        } catch (Exception exception){
            exception.printStackTrace();

        }

        filterChain.doFilter(request, response);



    }

    private String parseBearerToken(HttpServletRequest request){ //request에서 헤더 부분을 가져와서, auth 인증
        String authorization = request.getHeader("Authorization"); //헤더 가져오기

        boolean hasAuthorization = StringUtils.hasText(authorization); // authorization 부분을 가지고 있는지 확인
        if (!hasAuthorization) return null;

        boolean isBearer = authorization.startsWith("Bearer "); // Bearer 방식인지 아닌지 확인
        if (!isBearer) return null;

        String token = authorization.substring(7); // 반환할 토큰을 가져오기
        return token;
    }
    
}
