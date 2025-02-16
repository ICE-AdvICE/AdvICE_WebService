package com.icehufs.icebreaker.domain.auth.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.common.ResponseDto;
import com.icehufs.icebreaker.domain.auth.dto.object.JwtToken;

import lombok.Getter;

@Getter
public class SignInResponseDto extends ResponseDto { //ResponseDto의 code와 메시지에 토큰과 만료기간을 응답으로 반환

    private String accessToken;
    @JsonIgnore // 직렬화 시 RT는 전달 안되게 설정, 현재 서비스 코드가 반환값이 코드 확장하기 어렵게 되어있음
    private String refreshToken;
    private int expirationTime;

    private SignInResponseDto(String accessToken, String refreshToken){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expirationTime = 3600; //1시간
    }

    public static ResponseEntity<SignInResponseDto> success(JwtToken jwtToken){
        SignInResponseDto result = new SignInResponseDto(jwtToken.accessToken(), jwtToken.refreshToken());
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> signInFail() {
        ResponseDto result = new ResponseDto(ResponseCode.SIGN_IN_FAIL,ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
    
}
