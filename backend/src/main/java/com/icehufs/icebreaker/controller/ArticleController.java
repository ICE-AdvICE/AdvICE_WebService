package com.icehufs.icebreaker.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icehufs.icebreaker.dto.request.article.*;
import com.icehufs.icebreaker.dto.response.article.*;
import com.icehufs.icebreaker.service.ArticleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/article") // 익명게시판 일반 사용자 API 주소
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping("")// 게시글 등록 API
    public ResponseEntity<? super PostArticleResponseDto> postArticle(
        @RequestBody @Valid PostArticleRequestDto requestBody,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PostArticleResponseDto> response = articleService.postArticle(requestBody, email);
        return response;
    }

    @GetMapping("/{articleNum}") // 특정 게시글 반환 API
    public ResponseEntity<? super GetArticleResponseDto> getArticle(
        @PathVariable Integer articleNum
    ){
        ResponseEntity<? super GetArticleResponseDto> response = articleService.getArticle(articleNum);
        return response;
    }

    @PatchMapping("/{articleNum}") // 게시글 수정 API
    public ResponseEntity<? super PatchArticleResponseDto> patchArticle(
        @RequestBody @Valid PatchArticleRequestDto requestBody,
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PatchArticleResponseDto> response = articleService.patchArticle(requestBody, articleNum, email);
        return response;
    }

    @GetMapping("/own/{articleNum}") // 내가 쓴 게시글인지 확인 API
    public ResponseEntity<? super CheckOwnOfArticleResponseDto> checkOwnArticle(
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super CheckOwnOfArticleResponseDto> response = articleService.checkOwnArtcle(email, articleNum);
        return response;
    }

    @GetMapping("/{articleNum}/like") // 내가 좋아요 눌렀던 게시글인지 확인 API
    public ResponseEntity<? super CheckArticleFavoriteResponseDto> checkFavorite(
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super CheckArticleFavoriteResponseDto> response = articleService.checkFavorite(articleNum, email);
        return response;
    }

    @GetMapping("/list") // 모든 게시글 반환 API
    public ResponseEntity<? super GetArticleListResponseDto> getArticleList(){
        ResponseEntity<? super GetArticleListResponseDto> response = articleService.getArticleList();
        return response;
    }

    @GetMapping("/user-list") // 내가 쓴 모든 게시글 반환 API
        public ResponseEntity<? super GetUserArticleListResponseDto> patchUserPass(
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super GetUserArticleListResponseDto> response = articleService.getUserArticleList(email);
        return response;
    }

    @PutMapping("/{articleNum}/like") // 좋아요 누르기/취소하기 API
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PutFavoriteResponseDto> response = articleService.putFavorite(articleNum, email);
        return response;
    }

    @GetMapping("/{articleNum}/comment-list") // 특정 게시글의 모든 댓글 반환 API
    public ResponseEntity<? super GetCommentListResponseDto> getCommentList(
        @PathVariable Integer articleNum
    ){
        ResponseEntity<? super GetCommentListResponseDto> response = articleService.GetCommentList(articleNum);
        return response;
    }

    @DeleteMapping("/{articleNum}") // 특정 (MY)게시글 삭제 API
    public ResponseEntity<? super DeleteArticleResponseDto> deleteArticle(
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super DeleteArticleResponseDto> response = articleService.deleteArticle(articleNum, email);
        return response;
    }

}

