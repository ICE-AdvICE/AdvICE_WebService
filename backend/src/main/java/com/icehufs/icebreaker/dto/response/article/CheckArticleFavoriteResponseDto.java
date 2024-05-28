package com.icehufs.icebreaker.dto.response.article;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class CheckArticleFavoriteResponseDto extends ResponseDto{

        private CheckArticleFavoriteResponseDto() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }
    
    public static ResponseEntity<CheckArticleFavoriteResponseDto> success() {
        CheckArticleFavoriteResponseDto result = new CheckArticleFavoriteResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notFavorite(){
        ResponseDto result = new ResponseDto(ResponseCode.SUCCESS_BUT_NOT, ResponseMessage.SUCCESS_BUT_NOT);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }
    
    
}
