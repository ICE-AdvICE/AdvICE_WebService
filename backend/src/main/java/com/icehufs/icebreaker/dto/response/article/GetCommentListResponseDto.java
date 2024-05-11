package com.icehufs.icebreaker.dto.response.article;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.dto.object.CommentListItem;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.repository.GetCommentListReultSet;

import lombok.Getter;

@Getter
public class GetCommentListResponseDto extends ResponseDto {
    
    private List<CommentListItem> commentList;

    private GetCommentListResponseDto(List<GetCommentListReultSet> resultSets){
        super(ResponseCode.SUCCESS, ResponseCode.SUCCESS);
        this.commentList = CommentListItem.copyList(resultSets);
    }
    
        public static ResponseEntity<GetCommentListResponseDto> success(List<GetCommentListReultSet> resulSets){
        GetCommentListResponseDto result = new GetCommentListResponseDto(resulSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistArticle(){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_ARTICLE, ResponseMessage.NOT_EXISTED_ARTICLE);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
}
