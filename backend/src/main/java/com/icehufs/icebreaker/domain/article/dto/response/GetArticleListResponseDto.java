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
public class GetArticleListResponseDto extends ResponseDto{

    private List<ArticleListItem> articleList;

    private GetArticleListResponseDto(List<Article> articleEntities){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.articleList = ArticleListItem.getList(articleEntities);
    }

    public static ResponseEntity<GetArticleListResponseDto> success(List<Article> articleEntities){
        GetArticleListResponseDto result = new GetArticleListResponseDto(articleEntities);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
    
}
