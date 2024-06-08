package com.icehufs.icebreaker.entity;


import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "article_list_view")
@Table(name = "article_list_view")
public class ArticleListViewEntity {
    @Id
    private int article_num;
    private String user_email;
    private String article_title;
    private String article_content;
    private int like_count;
    private int view_count;
    private String article_date;
    private boolean auth_check;
    private ArticleCategoryEnum category;
}
