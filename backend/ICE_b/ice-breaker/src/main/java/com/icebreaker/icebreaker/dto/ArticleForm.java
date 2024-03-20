package com.icebreaker.icebreaker.dto;

import com.icebreaker.icebreaker.entity.Article;

import lombok.AllArgsConstructor;
import lombok.ToString;

@AllArgsConstructor // 생성자를 자동으로 생성
@ToString //tostring 메소드를 자동화
public class ArticleForm {
    private String title;
    private String content;

    public Article toEntity() { //폼 데이터를 담은 DTO 객체를 엔티티로 반환
        return new Article(null, title, content);

    }
    }


