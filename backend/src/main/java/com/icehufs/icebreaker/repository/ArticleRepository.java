package com.icehufs.icebreaker.repository;

import org.springframework.data.repository.CrudRepository;

import com.icehufs.icebreaker.entity.Article;

import java.util.ArrayList;

public interface ArticleRepository extends CrudRepository<Article, Long> {
    @Override
    ArrayList<Article> findAll(); // Iterable -> ArrayList 수정
}