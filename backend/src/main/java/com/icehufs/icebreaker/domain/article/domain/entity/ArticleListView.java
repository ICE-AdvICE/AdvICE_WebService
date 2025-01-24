package com.icehufs.icebreaker.domain.article.domain.entity;


import com.icehufs.icebreaker.domain.article.domain.type.ArticleCategoryEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "article_list_view")
@Table(name = "article_list_view")
public class ArticleListView {
    @Id
    private int article_num;
    private String article_title;
    private String article_content;
    private int like_count;
    private int view_count;
    private String article_date;
    private boolean auth_check;
    private ArticleCategoryEnum category;
}
