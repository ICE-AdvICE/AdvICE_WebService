package com.icehufs.icebreaker.domain.article.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.domain.article.domain.entity.Article;

@Repository
public interface ArtileListViewRepository extends JpaRepository<Article, Integer>{

    List<Article> findAll();
    List<Article> findByUserEmailOrderByArticleDateDesc(String userEmail);
    
}
