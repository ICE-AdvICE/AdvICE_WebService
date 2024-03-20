package com.icebreaker.icebreaker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.icebreaker.icebreaker.dto.ArticleForm;
import com.icebreaker.icebreaker.entity.Article;
import com.icebreaker.icebreaker.repository.ArticleRepository;

import lombok.extern.slf4j.Slf4j;




@Slf4j
@Controller
public class ArticleController {

    @Autowired // "new" 없이 미리 생성해놓은 객체를 가져다 준다
    private ArticleRepository articleRepository; //ArticleRepository 타임의 articlerepository 객체 선언

    @GetMapping("/articles/new")
    public String newArticleFrom() {
        return "new";
    }




    @PostMapping("/articles/create")
    public String createArticle(ArticleForm form) {
        log.info(form.toString());
        //1. DYO를 엔티티로 변화
        Article article = form.toEntity();
        log.info(article.toString());

        //2, 리파지터리로 엔티티를 DB에 저장

        Article saved = articleRepository.save(article);
        log.info(saved.toString());
        return "";
    }
    
    
}
