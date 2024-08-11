package com.icehufs.icebreaker.dto.response.codingzone;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.object.CodingZoneStudentListItem;
import com.icehufs.icebreaker.dto.response.ResponseDto;

import lombok.Getter;

@Getter
public class GetCodingZoneStudentListResponseDto extends ResponseDto{

    private List<CodingZoneStudentListItem> studentList;

    private GetCodingZoneStudentListResponseDto(List<CodingZoneStudentListItem> codingZoneStudentListItems){
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.studentList = CodingZoneStudentListItem.getList(codingZoneStudentListItems);
    }

    public static ResponseEntity<GetCodingZoneStudentListResponseDto> success(List<CodingZoneStudentListItem> codingZoneStudentListItems){
        GetCodingZoneStudentListResponseDto result = new GetCodingZoneStudentListResponseDto(codingZoneStudentListItems);
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
