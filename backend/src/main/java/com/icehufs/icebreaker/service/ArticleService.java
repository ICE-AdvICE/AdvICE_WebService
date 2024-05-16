package com.icehufs.icebreaker.service;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.dto.request.article.PatchArticleRequestDto;
import com.icehufs.icebreaker.dto.request.article.PatchCommentRequestDto;
import com.icehufs.icebreaker.dto.request.article.PostArticleRequestDto;
import com.icehufs.icebreaker.dto.request.article.PostCommentRequestDto;
import com.icehufs.icebreaker.dto.response.article.DeleteArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.DeleteCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleListResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetCommentListResponseDto;
import com.icehufs.icebreaker.dto.response.article.PatchArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PatchCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.PostArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PostCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.PutFavoriteResponseDto;




public interface ArticleService {

    ResponseEntity<? super PostArticleResponseDto> postArticle(PostArticleRequestDto dto, String email);
    ResponseEntity<? super GetArticleResponseDto> getArticle(Integer articleNum);
    ResponseEntity<? super GetArticleListResponseDto> getArticleList();
    ResponseEntity<? super PatchArticleResponseDto> patchArticle(PatchArticleRequestDto dto, Integer articleNum, String email);
    ResponseEntity<? super DeleteArticleResponseDto> deleteArticle(Integer articleNum, String email);

    ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer articleNum, String email);

    ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer articleNum, String email);
    ResponseEntity<? super GetCommentListResponseDto> GetCommentList(Integer articleNum);
    ResponseEntity<? super PatchCommentResponseDto> patchComment(PatchCommentRequestDto requestBody, Integer commentNumber, String email);
    ResponseEntity<? super DeleteCommentResponseDto> deleteComment(Integer commentNumber, String email);
}