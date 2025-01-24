package com.icehufs.icebreaker.domain.article.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.common.ResponseDto;

import lombok.Getter;

@Getter
public class PutResolvedArticleResponseDto extends ResponseDto {

    private PutResolvedArticleResponseDto() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }
    
    public static ResponseEntity<PutResolvedArticleResponseDto> success() {
        PutResolvedArticleResponseDto result = new PutResolvedArticleResponseDto();
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
