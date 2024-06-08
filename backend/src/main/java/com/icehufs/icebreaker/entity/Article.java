package com.icehufs.icebreaker.entity;


import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;

import javax.persistence.Column; //최근 버전에서는 import jakarta.persistence.~
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.icehufs.icebreaker.dto.request.article.PatchArticleRequestDto;
import com.icehufs.icebreaker.dto.request.article.PostArticleRequestDto;

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
        Date now = Date.from(Instant.now());
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String writeDatetime = simpleDateFormat.format(now);

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
    }
}