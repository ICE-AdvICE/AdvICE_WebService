package com.icehufs.icebreaker.dto.response.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.response.ResponseDto;

public class DeleteUserResponseDto extends ResponseDto{
    private DeleteUserResponseDto(){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

        public static ResponseEntity<DeleteUserResponseDto> success(){
            DeleteUserResponseDto result = new DeleteUserResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
        public static ResponseEntity<ResponseDto> notExistUser (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

    
}
