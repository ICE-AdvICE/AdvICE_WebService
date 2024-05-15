package com.icehufs.icebreaker.service;

import com.icehufs.icebreaker.dto.request.auth.EmailCertificationRequestDto;
import com.icehufs.icebreaker.dto.response.auth.EmailCertificationResponseDto;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.dto.request.auth.SignInRequestDto;
import com.icehufs.icebreaker.dto.request.auth.SignUpRequestDto;
import com.icehufs.icebreaker.dto.response.auth.SignInResponseDto;
import com.icehufs.icebreaker.dto.response.auth.SignUpResponseDto;

public interface AuthService {

    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
    ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto);
    
}
