package com.icehufs.icebreaker.domain.auth.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseDto;
import com.icehufs.icebreaker.common.ResponseMessage;

import lombok.Getter;

@Getter
public class LogoutResponseDto extends ResponseDto {
	private LogoutResponseDto(){
		super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
	}

	public static ResponseEntity<LogoutResponseDto> success(){
		LogoutResponseDto result = new LogoutResponseDto();
		return ResponseEntity.status(HttpStatus.OK).body(result);
	}
}
