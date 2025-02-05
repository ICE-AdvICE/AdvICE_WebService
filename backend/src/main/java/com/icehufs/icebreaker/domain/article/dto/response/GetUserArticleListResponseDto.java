package com.icehufs.icebreaker.domain.article.dto.response;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.domain.article.dto.object.ArticleListItem;
import com.icehufs.icebreaker.common.ResponseDto;
import com.icehufs.icebreaker.domain.article.domain.entity.Article;

import lombok.Getter;

@Getter
public class GetUserArticleListResponseDto extends ResponseDto{

    private List<ArticleListItem> userArticleList;

        private GetUserArticleListResponseDto(List<Article> articleEntities){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.userArticleList = ArticleListItem.getList(articleEntities);
    }

    public static ResponseEntity<GetUserArticleListResponseDto> success(List<Article> articleEntities){
        GetUserArticleListResponseDto result = new GetUserArticleListResponseDto(articleEntities);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistUser(){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
    
}
