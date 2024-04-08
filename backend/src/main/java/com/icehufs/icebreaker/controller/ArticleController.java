package com.icehufs.icebreaker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icehufs.icebreaker.dto.response.article.GetArticleListResponseDto;
import com.icehufs.icebreaker.service.ArticleService;

import lombok.RequiredArgsConstructor;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/article")
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping("/list")
    public ResponseEntity<? super GetArticleListResponseDto> getArticleList(){
        ResponseEntity<? super GetArticleListResponseDto> response = articleService.getArticleList();
        return response;
    }
    
    
    
}
