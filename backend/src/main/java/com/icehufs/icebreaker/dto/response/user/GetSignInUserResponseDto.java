package com.icehufs.icebreaker.dto.response.user;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.entity.User;

import lombok.Getter;


@Getter
public class GetSignInUserResponseDto extends ResponseDto {
    private String email;
    private String studentNum;
    private String name;

    private GetSignInUserResponseDto(User userEntity) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.email = userEntity.getEmail();
        this.studentNum = userEntity.getStudentNum();
        this.name = userEntity.getName();
    }

    public static ResponseEntity<GetSignInUserResponseDto> success(User userEntity) {
        GetSignInUserResponseDto result = new GetSignInUserResponseDto(userEntity);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistUser() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
}