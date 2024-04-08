package com.icehufs.icebreaker.service;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.dto.response.article.GetArticleListResponseDto;

public interface ArticleService {

    ResponseEntity<? super GetArticleListResponseDto> getArticleList();
}