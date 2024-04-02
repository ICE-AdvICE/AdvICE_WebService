package com.icehufs.icebreaker.dto.object;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ArticleListItem {
    //private User email;

    private String title;

    private String content;

    private int like;

    private int view;

    private boolean auth_check;

    private String category;
}
