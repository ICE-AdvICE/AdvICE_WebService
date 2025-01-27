package com.icehufs.icebreaker.domain.auth.controller;

import jakarta.validation.Valid;

import com.icehufs.icebreaker.domain.auth.dto.request.CheckCertificationRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.request.EmailCertificationRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.request.RegenerateTokenRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.request.SignInRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.request.SignUpRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.response.CheckCertificationResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.CheckUserBanResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.EmailCertificationResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.LogoutResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.PassChanEmailCertificationResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.RegenerateTokenResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.SignInResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.SignUpResponseDto;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.icehufs.icebreaker.domain.auth.service.AuthService;

import lombok.RequiredArgsConstructor;




@RestController
@RequestMapping("/api/v1/auth") //일반 사용자를 위한 URL 주소(회원가입/로그인/이메일 인증/정지 확인)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-up") // 회원가입 API
    public ResponseEntity<? super SignUpResponseDto> signUp(@RequestBody @Valid SignUpRequestDto requestBody){
        ResponseEntity<? super SignUpResponseDto> response = authService.signUp(requestBody);
    
        return response;
    }

    @PostMapping("/sign-in") // 로그인 API
    //메소드의 반환 타입과 값을 response로 선언
    //ResponseEntity는 HTTP 응답의 본문(body), 상태 코드(status code), 헤더(headers) 등을 포함
    //요청에 대한 응답을 보낼때 SignInResponseDto으로 미리정한 다양한 타입의 응답을 처리가능
    public ResponseEntity<? super SignInResponseDto> signIn(@RequestBody @Valid SignInRequestDto requestBody){
        //@RequestBody 어노테이션은 HTTP 요청의 본문(body)을 SignInRequestDto 객체로 매핑
        //@Valid 요청 본문이 SignInRequestDto 클래스에 정의된 제약 조건들을 만족하는지 검증
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody);
        return response;
    }

    @PostMapping("/logout")
    public ResponseEntity<? super LogoutResponseDto> logout(@AuthenticationPrincipal String email) {
        ResponseEntity<? super LogoutResponseDto> response = authService.logout(email);
        return response;
    }

    @PostMapping("/refresh")
    public ResponseEntity<? super RegenerateTokenResponseDto> refresh(@AuthenticationPrincipal String email,
        @RequestBody @Valid RegenerateTokenRequestDto requestBody) {
        ResponseEntity<? super RegenerateTokenResponseDto> response = authService.refresh(requestBody, email);
        return response;
    }

    @PostMapping("/email-certification") // 회원가입 시 인증 번호 전송 API
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification (
            @RequestBody @Valid EmailCertificationRequestDto requestBody
    ) {
        ResponseEntity<? super EmailCertificationResponseDto> response = authService.emailCertification(requestBody);
        return response;
    }

    @PostMapping("/password-change/email-certification") // 비밀 번호 변경 시 인증 번호 전송 API
    public ResponseEntity<? super PassChanEmailCertificationResponseDto> passChanEmailCertification (
        @RequestBody @Valid EmailCertificationRequestDto requestBody
) {
    ResponseEntity<? super PassChanEmailCertificationResponseDto> response = authService.passChanEmailCertif(requestBody);
    return response;
}

    @PostMapping("/check-certification") // 인증번호 확인 API
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification (
            @RequestBody @Valid CheckCertificationRequestDto requestBody
    ) {
        ResponseEntity<? super CheckCertificationResponseDto> response = authService.checkCertification(requestBody);
        return response;
    }

    @PostMapping("/check-user-ban") // 정지 여부 확인 api 
    public ResponseEntity<? super CheckUserBanResponseDto> checkUserBanStatus(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return authService.checkUserBanStatus(jwtToken);
    }
}
