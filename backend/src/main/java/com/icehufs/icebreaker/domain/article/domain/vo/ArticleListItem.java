package com.icehufs.icebreaker.domain.article.domain.vo;


import java.util.ArrayList;
import java.util.List;

import com.icehufs.icebreaker.domain.article.domain.entity.Article;
import com.icehufs.icebreaker.domain.article.domain.type.ArticleCategoryEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ArticleListItem {

    private int articleNum;
    private String articleTitle;
    private String articleContent;
    private int likeCount;
    private int viewCount;
    private String articleDate;
    private int authCheck;
    private ArticleCategoryEnum category;

    public ArticleListItem(Article articleListViewEntity) {
        this.articleNum = articleListViewEntity.getArticleNum();
        this.articleTitle = articleListViewEntity.getArticleTitle();
        this.articleContent = articleListViewEntity.getArticleContent();
        this.likeCount = articleListViewEntity.getLikeCount();
        this.viewCount = articleListViewEntity.getViewCount();
        this.articleDate = articleListViewEntity.getArticleDate();
        this.authCheck = articleListViewEntity.getAuthCheck();
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
