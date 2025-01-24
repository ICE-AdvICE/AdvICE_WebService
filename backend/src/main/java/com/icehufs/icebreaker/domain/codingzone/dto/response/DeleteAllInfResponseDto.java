package com.icehufs.icebreaker.domain.codingzone.dto.response;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.common.ResponseDto;

public class DeleteAllInfResponseDto extends ResponseDto{

        private DeleteAllInfResponseDto(){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

        public static ResponseEntity<DeleteAllInfResponseDto> success(){
            DeleteAllInfResponseDto result = new DeleteAllInfResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
        public static ResponseEntity<ResponseDto> notExistUser (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
}
