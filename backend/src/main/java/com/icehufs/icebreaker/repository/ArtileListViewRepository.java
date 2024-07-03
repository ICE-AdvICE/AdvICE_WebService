package com.icehufs.icebreaker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.Article;

@Repository
public interface ArtileListViewRepository extends JpaRepository<Article, Integer>{

    List<Article> findAll();
    List<Article> findByUserEmailOrderByArticleDateDesc(String userEmail);
    
}
