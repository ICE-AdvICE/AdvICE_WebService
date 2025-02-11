package com.icehufs.icebreaker.domain.codingzone.dto.response;

import com.icehufs.icebreaker.common.ResponseDto;
import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;

import lombok.Getter;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class DownloadArticleExcelResponseDto extends ResponseDto {

    private DownloadArticleExcelResponseDto() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<DownloadArticleExcelResponseDto> success() {
        DownloadArticleExcelResponseDto result = new DownloadArticleExcelResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> failed() {
        ResponseDto result = new ResponseDto(ResponseCode.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}
