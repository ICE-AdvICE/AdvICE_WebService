package com.icehufs.icebreaker.domain.article.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.domain.article.domain.entity.Article;



@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {
    
    boolean existsByArticleNum(Integer articleNum); // 정확한 필드 이름을 사용
    Article findByArticleNum(Integer articleNum);   // 정확한 필드 이름을 사용

}
