package com.icehufs.icebreaker.service;

import com.icehufs.icebreaker.dto.request.auth.*;
import com.icehufs.icebreaker.dto.response.auth.*;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
    ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto);
    ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto);
    ResponseEntity<? super GiveUserBanResponseDto> giveUserBan(GiveUserBanRequestDto dto);
}
