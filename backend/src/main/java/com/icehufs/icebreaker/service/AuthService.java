package com.icehufs.icebreaker.service;

import org.springframework.http.ResponseEntity;

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

public interface AuthService {

    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
    ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto);
    ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto);
    ResponseEntity<? super GiveUserBanResponseDto> giveUserBan(GiveUserBanRequestDto dto);
    ResponseEntity<? super PassChanEmailCertificationResponseDto> passChanEmailCertif(EmailCertificationRequestDto dto);
}
