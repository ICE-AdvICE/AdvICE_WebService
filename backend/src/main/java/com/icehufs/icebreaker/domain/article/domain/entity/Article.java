package com.icehufs.icebreaker.domain.article.domain.entity;


import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.icehufs.icebreaker.domain.article.dto.request.PatchArticleRequestDto;
import com.icehufs.icebreaker.domain.article.dto.request.PostArticleRequestDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Entity(name = "article")
@Table(name = "article")
public class Article {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB가 id 자동 생성
    @Column(name = "article_num")
    private int articleNum;
    // 외래키 User 테이블의 컬럼명: email, 다대일 관계 설정.
    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "article_title")
    private String articleTitle;

    @Column(name = "article_content")
    private String articleContent;

    @Column(name = "like_count")
    private int likeCount;

    @Column(name = "view_count")
    private int viewCount;

    @Column(name = "article_date")
    private String articleDate;

    @Column(name = "auth_check")
    private int authCheck;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "category")
    private ArticleCategoryEnum category;

    public Article(PostArticleRequestDto dto, String email){
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String writeDatetime = now.format(formatter);

        this.userEmail = email;
        this.articleTitle = dto.getArticleTitle();
        this.articleContent = dto.getArticleContent();
        this.likeCount = 0;
        this.viewCount = 0;
        this.articleDate = writeDatetime;
        this.authCheck = 0;
        this.category = dto.getCategory();
    }

    public void IncreaseViewCount(){
        this.viewCount++;
    }

    public void IncreaseFavoriteCount(){
        this.likeCount++;
    }

    public void decreaseFavoriteCount(){
        this.likeCount --;
    }

    public void patchArticle(PatchArticleRequestDto dto) {
        this.articleTitle = dto.getArticleTitle();
        this.articleContent = dto.getArticleContent();
        this.category = dto.getCategory();
    }

    public void putResolv() {
        this.authCheck = 1;
    }
}