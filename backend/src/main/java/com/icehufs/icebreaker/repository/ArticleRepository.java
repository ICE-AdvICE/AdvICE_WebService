package com.icehufs.icebreaker.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.Article;



@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {
    
    Article findByArticleNum(int articleNum);

}