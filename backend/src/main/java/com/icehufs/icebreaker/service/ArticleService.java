package com.icehufs.icebreaker.service;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.dto.request.article.PostArticleRequestDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleListResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PostArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PutFavoriteResponseDto;


public interface ArticleService {

    ResponseEntity<? super PostArticleResponseDto> postArticle(PostArticleRequestDto dto, String email);
    ResponseEntity<? super GetArticleResponseDto> getArticle(Integer articleNum);
    ResponseEntity<? super GetArticleListResponseDto> getArticleList();
    ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer articleNum, String email);
}