package com.icehufs.icebreaker.domain.auth.service;

import com.icehufs.icebreaker.domain.auth.dto.request.CheckCertificationRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.request.EmailCertificationRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.request.GiveUserBanRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.request.RegenerateTokenRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.request.SignInRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.request.SignUpRequestDto;
import com.icehufs.icebreaker.domain.auth.dto.response.CheckCertificationResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.CheckUserBanResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.EmailCertificationResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.GiveUserBanResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.LogoutResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.PassChanEmailCertificationResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.RegenerateTokenResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.SignInResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.response.SignUpResponseDto;

import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
    ResponseEntity<? super LogoutResponseDto> logout(String email);
    ResponseEntity<? super RegenerateTokenResponseDto> refresh(String refreshToken, String email);
    ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificationRequestDto dto);
    ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto);
    ResponseEntity<? super GiveUserBanResponseDto> giveUserBan(GiveUserBanRequestDto dto, Integer articleNum, String email);
    ResponseEntity<? super PassChanEmailCertificationResponseDto> passChanEmailCertif(EmailCertificationRequestDto dto);
    ResponseEntity<? super CheckUserBanResponseDto> checkUserBanStatus(String token);

}
