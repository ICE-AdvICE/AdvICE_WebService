package com.icehufs.icebreaker.domain.codingzone.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.common.ResponseDto;

public class CodingZoneCanceResponseDto extends ResponseDto{

    private CodingZoneCanceResponseDto(){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<CodingZoneCanceResponseDto> success(){
        CodingZoneCanceResponseDto result = new CodingZoneCanceResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistUser (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

    public static ResponseEntity<ResponseDto> notReserve (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_RESERVE_CLASS, ResponseMessage.NOT_RESERVE_CLASS);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
}
