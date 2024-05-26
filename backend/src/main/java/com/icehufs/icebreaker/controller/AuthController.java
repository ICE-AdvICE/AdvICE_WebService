package com.icehufs.icebreaker.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icehufs.icebreaker.dto.request.auth.CheckCertificationRequestDto;
import com.icehufs.icebreaker.dto.request.auth.EmailCertificationRequestDto;
import com.icehufs.icebreaker.dto.request.auth.GiveUserBanRequestDto;
import com.icehufs.icebreaker.dto.request.auth.SignInRequestDto;
import com.icehufs.icebreaker.dto.request.auth.SignUpRequestDto;
import com.icehufs.icebreaker.dto.response.auth.CheckCertificationResponseDto;
import com.icehufs.icebreaker.dto.response.auth.EmailCertificationResponseDto;
import com.icehufs.icebreaker.dto.response.auth.GiveUserBanResponseDto;
import com.icehufs.icebreaker.dto.response.auth.PassChanEmailCertificationResponseDto;
import com.icehufs.icebreaker.dto.response.auth.SignInResponseDto;
import com.icehufs.icebreaker.dto.response.auth.SignUpResponseDto;
import com.icehufs.icebreaker.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;



@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<? super SignUpResponseDto> signUp(@RequestBody @Valid SignUpRequestDto requestBody){
        ResponseEntity<? super SignUpResponseDto> response = authService.signUp(requestBody);
    
        return response;
    }

    @PostMapping("/sign-in") //메소드의 반환 타입과 값을 response로 선언
    //ResponseEntity는 HTTP 응답의 본문(body), 상태 코드(status code), 헤더(headers) 등을 포함
    //요청에 대한 응답을 보낼때 SignInResponseDto으로 미리정한 다양한 타입의 응답을 처리가능
    public ResponseEntity<? super SignInResponseDto> signIn(@RequestBody @Valid SignInRequestDto requestBody){
        //@RequestBody 어노테이션은 HTTP 요청의 본문(body)을 SignInRequestDto 객체로 매핑
        //@Valid 요청 본문이 SignInRequestDto 클래스에 정의된 제약 조건들을 만족하는지 검증
        ResponseEntity<? super SignInResponseDto> response = authService.signIn(requestBody);
        return response;
    }

    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification (
            @RequestBody @Valid EmailCertificationRequestDto requestBody
    ) {
        ResponseEntity<? super EmailCertificationResponseDto> response = authService.emailCertification(requestBody);
        return response;
    }

    @PostMapping("/password-change/email-certification")
    public ResponseEntity<? super PassChanEmailCertificationResponseDto> passChanEmailCertification (
        @RequestBody @Valid EmailCertificationRequestDto requestBody
) {
    ResponseEntity<? super PassChanEmailCertificationResponseDto> response = authService.passChanEmailCertif(requestBody);
    return response;
}

    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification (
            @RequestBody @Valid CheckCertificationRequestDto requestBody
    ) {
        ResponseEntity<? super CheckCertificationResponseDto> response = authService.checkCertification(requestBody);
        return response;
    }

    @PostMapping("/give-ban")
    public ResponseEntity<? super GiveUserBanResponseDto> GiveUserBan (
            @RequestBody @Valid GiveUserBanRequestDto requestBody
    ) {
        ResponseEntity<? super GiveUserBanResponseDto> response = authService.giveUserBan(requestBody);
        return response;
    }


}
