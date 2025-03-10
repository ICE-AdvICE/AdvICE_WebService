package com.icehufs.icebreaker.domain.codingzone.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.common.ResponseDto;


import lombok.Getter;

@Getter
public class GetCountOfAttendResponseDto extends ResponseDto{
    private Integer NumOfAttend;

    private GetCountOfAttendResponseDto(Integer NumOfAttend){
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.NumOfAttend = NumOfAttend;
    }

    public static ResponseEntity<GetCountOfAttendResponseDto> success(Integer NumOfAttend){
        GetCountOfAttendResponseDto result = new GetCountOfAttendResponseDto(NumOfAttend);
        return ResponseEntity.status(HttpStatus.OK).body(result);
}

public static ResponseEntity<ResponseDto> notExistUser (){
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
}

public static ResponseEntity<ResponseDto> noExistArticle(){
    ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_ARTICLE, ResponseMessage.NOT_EXISTED_ARTICLE);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
}
}
