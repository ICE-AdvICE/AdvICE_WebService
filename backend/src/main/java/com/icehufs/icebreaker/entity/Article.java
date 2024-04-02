package com.icehufs.icebreaker.entity;

import java.time.LocalDateTime;

import javax.persistence.Column; //최근 버전에서는 import jakarta.persistence.~
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Entity
@Table(name = "article")
public class Article {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB가 id 자동 생성
    @Column(name = "board_no")
    private Long id;
    
    // 외래키 User 테이블의 컬럼명: email, 다대일 관계 설정.
    @ManyToOne
    @JoinColumn(name = "user_email")
    private User email;

    @Column(name = "article_title")
    private String title;

    @Column(name = "article_content")
    private String content;

    @Column(name = "like")
    private int like;

    @Column(name = "view")
    private int view;

    @Column(name = "article_date")
    private LocalDateTime date;

    @Column(name = "auth_check")
    private boolean auth_check;

    @Column(name = "category")
    private String category;

    // 게시글 수정을 위한 코드
    public void patch(Article article) {
        if (article.title != null)
            this.title = article.title;
        if (article.content != null)
            this.content = article.content;
    }
}