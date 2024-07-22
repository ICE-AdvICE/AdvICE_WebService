package com.icehufs.icebreaker.service;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.dto.request.article.*;
import com.icehufs.icebreaker.dto.response.article.*;





public interface ArticleService {

    ResponseEntity<? super PostArticleResponseDto> postArticle(PostArticleRequestDto dto, String email);
    ResponseEntity<? super PostArticleResponseDto> postArticleNotif(PostArticleRequestDto dto, String email);
    ResponseEntity<? super GetArticleResponseDto> getArticle(Integer articleNum);
    ResponseEntity<? super GetArticleListResponseDto> getArticleList();
    ResponseEntity<? super GetUserArticleListResponseDto> getUserArticleList(String email);
    ResponseEntity<? super PatchArticleResponseDto> patchArticle(PatchArticleRequestDto dto, Integer articleNum, String email);
    ResponseEntity<? super CheckOwnOfArticleResponseDto> checkOwnArtcle(String email, Integer articleNum);
    ResponseEntity<? super DeleteArticleResponseDto> deleteArticle(Integer articleNum, String email);
    ResponseEntity<? super DeleteArticleAdminResponseDto> deleteArticleAdmin(Integer articleNum, String email);
    ResponseEntity<? super CheckArticleFavoriteResponseDto> checkFavorite(Integer articleNum, String email);
    ResponseEntity<? super PutResolvedArticleResponseDto> putResolv(Integer articleNum, String email);

    ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer articleNum, String email);

    ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer articleNum, String email);
    ResponseEntity<? super GetCommentListResponseDto> GetCommentList(Integer articleNum);
    ResponseEntity<? super PatchCommentResponseDto> patchComment(PatchCommentRequestDto requestBody, Integer commentNumber, String email);
    ResponseEntity<? super DeleteCommentResponseDto> deleteComment(Integer commentNumber, String email);

}