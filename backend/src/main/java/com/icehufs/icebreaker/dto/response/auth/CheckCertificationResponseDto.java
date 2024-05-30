    package com.icehufs.icebreaker.dto.response.auth;

    import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.response.ResponseDto;

import lombok.Getter;

    @Getter
    public class CheckCertificationResponseDto extends ResponseDto {

        private CheckCertificationResponseDto(){
            super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        }

        public static ResponseEntity<CheckCertificationResponseDto> success() {
            CheckCertificationResponseDto responseBody = new CheckCertificationResponseDto();
            return ResponseEntity.status(HttpStatus.OK).body(responseBody);
        }

        public static ResponseEntity<ResponseDto> certificationFail(){
            ResponseDto responseBody = new ResponseDto(ResponseCode.VALIDATION_FAILED, ResponseMessage.VALIDATION_FAILED );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
        }
    }
