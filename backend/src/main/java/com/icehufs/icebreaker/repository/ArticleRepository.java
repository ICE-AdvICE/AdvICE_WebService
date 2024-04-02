package com.icehufs.icebreaker.repository;

import java.util.ArrayList;

import org.springframework.data.repository.CrudRepository;

import com.icehufs.icebreaker.entity.Article;



public interface ArticleRepository extends CrudRepository<Article, Long> {
    @Override
    ArrayList<Article> findAll(); // Iterable -> ArrayList 수정
}