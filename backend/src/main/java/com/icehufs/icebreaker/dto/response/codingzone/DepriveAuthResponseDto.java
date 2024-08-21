package com.icehufs.icebreaker.dto.response.codingzone;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class DepriveAuthResponseDto extends ResponseDto{
    private DepriveAuthResponseDto(){
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<DepriveAuthResponseDto> success(){
        DepriveAuthResponseDto result = new DepriveAuthResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notSingUpUser (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_SIGNUP_USER, ResponseMessage.NOT_SIGNUP_USER);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    public static ResponseEntity<ResponseDto> alreadyPerm (){
        ResponseDto result = new ResponseDto(ResponseCode.PERMITTED_ERROR, ResponseMessage.PERMITTED_ERROR);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistUser (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
}
