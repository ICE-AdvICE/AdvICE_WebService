package com.icehufs.icebreaker.domain.codingzone.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.domain.codingzone.dto.object.CodingZoneAssitantListItem;
import com.icehufs.icebreaker.common.ResponseDto;
import com.icehufs.icebreaker.domain.membership.domain.entity.User;

import java.util.List;
import lombok.Getter;

@Getter
public class GetCodingZoneAssitantListResponseDto extends ResponseDto{

    private List<CodingZoneAssitantListItem> ListOfCodingZone1;
    private List<CodingZoneAssitantListItem> ListOfCodingZone2;

    private GetCodingZoneAssitantListResponseDto(List<User> user1, List<User> user2){
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.ListOfCodingZone1 = CodingZoneAssitantListItem.getList(user1);
    this.ListOfCodingZone2 = CodingZoneAssitantListItem.getList(user2);
    }

    public static ResponseEntity<GetCodingZoneAssitantListResponseDto> success(List<User> user1, List<User> user2){
        GetCodingZoneAssitantListResponseDto result = new GetCodingZoneAssitantListResponseDto(user1, user2);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistUser (){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
}
