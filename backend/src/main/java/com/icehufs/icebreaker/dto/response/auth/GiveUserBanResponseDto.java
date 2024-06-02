package com.icehufs.icebreaker.dto.response.auth;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class GiveUserBanResponseDto extends ResponseDto {
    private GiveUserBanResponseDto(){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<GiveUserBanResponseDto> success(){
        GiveUserBanResponseDto responseBody = new GiveUserBanResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> duplicateId(){
        ResponseDto responseBody = new ResponseDto(ResponseCode.DUPLICATE_EMAIL, ResponseMessage.DUPLICATE_EMAIL);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }

    public static ResponseEntity<? super GiveUserBanResponseDto> notMatchId() {
        ResponseDto result = new ResponseDto(ResponseCode.DOES_NOT_MATCH_EMAIL, ResponseMessage.DOES_NOT_MATCH_EMAIL);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistUser (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistArticle(){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_ARTICLE, ResponseMessage.NOT_EXISTED_ARTICLE);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result); }
}
