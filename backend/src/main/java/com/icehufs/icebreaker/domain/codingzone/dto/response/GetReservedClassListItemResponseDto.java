package com.icehufs.icebreaker.domain.codingzone.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;

import com.icehufs.icebreaker.domain.codingzone.dto.object.ReservedClassListItem;
import com.icehufs.icebreaker.common.ResponseDto;

import lombok.Getter;

@Getter
public class GetReservedClassListItemResponseDto extends ResponseDto{

    private List<ReservedClassListItem> studentList;

    private GetReservedClassListItemResponseDto(List<ReservedClassListItem> reservedClassListItems){
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.studentList = ReservedClassListItem.getList(reservedClassListItems);
    }

    public static ResponseEntity<GetReservedClassListItemResponseDto> success(List<ReservedClassListItem> reservedClassListItems){
        GetReservedClassListItemResponseDto result = new GetReservedClassListItemResponseDto(reservedClassListItems);
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
