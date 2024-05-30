package com.icehufs.icebreaker.provider;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtProvider {

    @Value("${secret-key}")
    private String secretKey;

    public String create(String email){  //메일을 받고 jwt를 만들기 위한 함수
        Date expiredDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS)); //토큰 만료시간을 1시간으로 설정

        String jwt = Jwts.builder() //본격적인 jwt(토큰) 생성코드
                .signWith(SignatureAlgorithm.HS256, secretKey) //HS256 알고리즘과 secretKey를 사용하여 토큰에 서명
                .setSubject(email).setIssuedAt(new Date()).setExpiration(expiredDate)
                .compact();
        return jwt;
    }

    public String validate(String jwt){ //jwt의 secretKey, 만료시간 확인하고, JWT 내부의 클레임의 주제인 이메일을 추출하는 함수
        Claims claims = null;

        try{
            claims = Jwts.parser().setSigningKey(secretKey)
                    .parseClaimsJws(jwt).getBody();
        } catch (Exception exception){
            exception.printStackTrace();
            return null;
        }

        return claims.getSubject();
    }

    public String extractEmail(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
