package com.icehufs.icebreaker.dto.response.article;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class PostArticleResponseDto extends ResponseDto{
    
    private PostArticleResponseDto(){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<PostArticleResponseDto> success(){
        PostArticleResponseDto result = new PostArticleResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistUser (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
    // 정지된 유저일 경우 다음과 같은 response 전달.
    public static ResponseEntity<ResponseDto> bannedUser() {
        ResponseDto responseBody = new ResponseDto(ResponseCode.BANNED_USER, ResponseMessage.BANNED_USER);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseBody);
    }
}
