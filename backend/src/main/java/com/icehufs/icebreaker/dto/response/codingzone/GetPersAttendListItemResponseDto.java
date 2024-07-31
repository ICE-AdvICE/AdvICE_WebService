package com.icehufs.icebreaker.dto.response.codingzone;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.object.PersAttendManagListItem;
import com.icehufs.icebreaker.dto.response.ResponseDto;

import lombok.Getter;

@Getter 
public class GetPersAttendListItemResponseDto extends ResponseDto{

    private List<PersAttendManagListItem> attendList;

    private GetPersAttendListItemResponseDto(List<PersAttendManagListItem> persAttendManagListItems){
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.attendList = PersAttendManagListItem.getList(persAttendManagListItems);
    }

    public static ResponseEntity<GetPersAttendListItemResponseDto> success(List<PersAttendManagListItem> persAttendManagListItems){
        GetPersAttendListItemResponseDto result = new GetPersAttendListItemResponseDto(persAttendManagListItems);
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
