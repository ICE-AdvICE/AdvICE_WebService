package com.icehufs.icebreaker.domain.codingzone.dto.response;

import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.domain.codingzone.domain.entity.GroupInf;
import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.domain.codingzone.domain.vo.GroupInfListItem;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lombok.Getter;

@Getter
public class GetListOfGroupInfResponseDto extends ResponseDto{
    
    private List<GroupInfListItem> groupList;

    private GetListOfGroupInfResponseDto(List<GroupInf> groupInfEntities){
    super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    this.groupList = GroupInfListItem.getList(groupInfEntities);
    }

    public static ResponseEntity<GetListOfGroupInfResponseDto> success(List<GroupInf> groupInfEntities){
        GetListOfGroupInfResponseDto result = new GetListOfGroupInfResponseDto(groupInfEntities);
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
