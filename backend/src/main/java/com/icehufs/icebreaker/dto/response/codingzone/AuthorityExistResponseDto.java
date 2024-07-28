package com.icehufs.icebreaker.dto.response.codingzone;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.response.ResponseDto;

public class AuthorityExistResponseDto extends ResponseDto{

        private AuthorityExistResponseDto(){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<AuthorityExistResponseDto> success(){
        AuthorityExistResponseDto result = new AuthorityExistResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistUser (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
    public static ResponseEntity<ResponseDto> codingAdmin(){
        ResponseDto result = new ResponseDto(ResponseCode.CODING_ADMIN, ResponseMessage.CODING_ADMIN);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> entireAdmin(){
        ResponseDto result = new ResponseDto(ResponseCode.ENTIRE_ADMIN, ResponseMessage.ENTIRE_ADMIN);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
    
}
