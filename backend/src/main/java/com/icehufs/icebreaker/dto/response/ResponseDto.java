package com.icehufs.icebreaker.dto.response;

//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResponseDto {

    private String code;
    private String message;

    //   public static ResponseEntity<ResponseDto> databaseError(){
    //     ResponseDto responseDto = new  ResponseDto(ResponseCode.DATABASE_ERROR, ResponseMessage.DATABASE_ERROR);
    //      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    //}
    
}
