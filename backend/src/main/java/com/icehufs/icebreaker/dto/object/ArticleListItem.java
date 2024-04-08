package com.icehufs.icebreaker.dto.object;


import java.util.ArrayList;
import java.util.List;

import com.icehufs.icebreaker.entity.Article;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ArticleListItem {

    private int article_num;
    private String user_email;
    private String article_title;
    private String article_content;
    private int like_count;
    private int view_count;
    private String article_date;
    private int auth_check;
    private String category;

    public ArticleListItem(Article articleListViewEntity) {
        this.article_num = articleListViewEntity.getArticle_num();
        this.user_email = articleListViewEntity.getUser_email();
        this.article_title = articleListViewEntity.getArticle_title();
        this.article_content = articleListViewEntity.getArticle_content();
        this.like_count = articleListViewEntity.getLike_count();
        this.view_count = articleListViewEntity.getView_count();
        this.article_date = articleListViewEntity.getArticle_date();
        this.auth_check = articleListViewEntity.getAuth_check();
        this.category = articleListViewEntity.getCategory();
    }

    public static List<ArticleListItem> getList(List<Article> articleListViewEntities) {
        List<ArticleListItem> list = new ArrayList<>();
        for (Article articleListViewEntity: articleListViewEntities){
            ArticleListItem articleListItem = new ArticleListItem(articleListViewEntity);
            list.add(articleListItem);
        }
        return list;
    }
}
