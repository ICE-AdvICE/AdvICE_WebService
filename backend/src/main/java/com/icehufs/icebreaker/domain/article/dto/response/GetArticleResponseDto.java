package com.icehufs.icebreaker.domain.article.dto.response;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseMessage;
import com.icehufs.icebreaker.common.ResponseDto;
import com.icehufs.icebreaker.domain.article.domain.entity.Article;
import com.icehufs.icebreaker.domain.article.domain.type.ArticleCategoryEnum;

import lombok.Getter;

@Getter
public class GetArticleResponseDto extends ResponseDto {

    private int articleNum;
    private String articleTitle;
    private String articleContent;
    private int likeCount;
    private int viewCount;
    private LocalDateTime articleDate;
    private int authCheck;
    private ArticleCategoryEnum category;

    private GetArticleResponseDto(Article articleEntity){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.articleNum = articleEntity.getArticleNum();
        this.articleTitle = articleEntity.getArticleTitle();
        this.articleContent = articleEntity.getArticleContent();
        this.likeCount = articleEntity.getLikeCount();
        this.viewCount = articleEntity.getViewCount();
        this.articleDate = articleEntity.getArticleDate();
        this.authCheck = articleEntity.getAuthCheck();
        this.category = articleEntity.getCategory();
    }

    public static ResponseEntity<GetArticleResponseDto> success(Article articleEntity){
        GetArticleResponseDto result = new GetArticleResponseDto(articleEntity);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistArticle(){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_ARTICLE, ResponseMessage.NOT_EXISTED_ARTICLE);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
    
}
