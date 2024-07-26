package com.icehufs.icebreaker.dto.response.codingzone;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.response.ResponseDto;

public class CodingZoneRegisterResponseDto extends ResponseDto{
        private CodingZoneRegisterResponseDto(){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<CodingZoneRegisterResponseDto> success(){
        CodingZoneRegisterResponseDto result = new CodingZoneRegisterResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistUser (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

    public static ResponseEntity<ResponseDto> fullClass (){
        ResponseDto result = new ResponseDto(ResponseCode.FULL_CLASS, ResponseMessage.FULL_CLASS);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    public static ResponseEntity<ResponseDto> alreadyReserve (){
        ResponseDto result = new ResponseDto(ResponseCode.ALREADY_RESERVE, ResponseMessage.ALREADY_RESERVE);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
    
}
