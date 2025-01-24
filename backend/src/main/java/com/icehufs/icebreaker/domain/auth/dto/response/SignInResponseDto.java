package com.icehufs.icebreaker.domain.auth.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.common.ResponseDto;

import lombok.Getter;

@Getter
public class SignInResponseDto extends ResponseDto { //ResponseDto의 code와 메시지에 토큰과 만료긴간을 응답으로 반환

    private String token;
    private int expirationTime;

    private SignInResponseDto(String token){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.token = token;
        this.expirationTime = 3600; //1시간
    }

    public static ResponseEntity<SignInResponseDto> success(String token){
        SignInResponseDto result = new SignInResponseDto(token);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> signInFail() {
        ResponseDto result = new ResponseDto(ResponseCode.SIGN_IN_FAIL,ResponseMessage.SIGN_IN_FAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
    
}
