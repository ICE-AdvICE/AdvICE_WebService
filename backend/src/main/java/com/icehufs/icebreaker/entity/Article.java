package com.icehufs.icebreaker.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Getter
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB가 id 자동 생성
    @Column(name = "board_no")
    private Long id;
    // 외래키 User 테이블의 컬럼명: user_no, 다대일 관계 설정.
    @ManyToOne
    @JoinColumn(name = "uesr_no")
    private User user_no;
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