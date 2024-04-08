package com.icehufs.icebreaker.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.article.GetArticleListResponseDto;
import com.icehufs.icebreaker.entity.Article;
import com.icehufs.icebreaker.repository.ArtileListViewRepository;
import com.icehufs.icebreaker.service.ArticleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleServiceImplement implements ArticleService {

    private final ArtileListViewRepository artileListViewRepository;
    
    
    
    @Override
    public ResponseEntity<? super GetArticleListResponseDto> getArticleList() {
        List<Article> articleListViewEntities = new ArrayList<>();

        try{
            articleListViewEntities = artileListViewRepository.findAll();

        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetArticleListResponseDto.success(articleListViewEntities);
    }
    
}
