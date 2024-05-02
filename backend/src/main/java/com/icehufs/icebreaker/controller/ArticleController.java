package com.icehufs.icebreaker.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icehufs.icebreaker.dto.request.article.PostArticleRequestDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleListResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PostArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PutFavoriteResponseDto;
import com.icehufs.icebreaker.service.ArticleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/article")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping("")
    public ResponseEntity<? super PostArticleResponseDto> postArticle(
        @RequestBody @Valid PostArticleRequestDto requestBody,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PostArticleResponseDto> response = articleService.postArticle(requestBody, email);
        return response;
    }

    @GetMapping("/{articleNum}")
    public ResponseEntity<? super GetArticleResponseDto> getArticle(
        @PathVariable("articleNum") Integer articleNum
    ){
        ResponseEntity<? super GetArticleResponseDto> response = articleService.getArticle(articleNum);
        return response;
    }

    @GetMapping("/list")
    public ResponseEntity<? super GetArticleListResponseDto> getArticleList(){
        ResponseEntity<? super GetArticleListResponseDto> response = articleService.getArticleList();
        return response;
    }

    @PutMapping("/{articleNum}/like")
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(
        @PathVariable("articleNum") Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PutFavoriteResponseDto> response = articleService.putFavorite(articleNum, email);
        return response;
    }
}
