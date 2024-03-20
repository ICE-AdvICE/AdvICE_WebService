package com.icebreaker.icebreaker.repository;
import org.springframework.data.repository.CrudRepository;

import com.icebreaker.icebreaker.entity.Article;

public interface ArticleRepository extends CrudRepository<Article, Long> {

    
}

