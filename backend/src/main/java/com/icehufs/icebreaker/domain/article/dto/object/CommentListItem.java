package com.icehufs.icebreaker.domain.article.dto.object;

import java.util.ArrayList;
import java.util.List;

import com.icehufs.icebreaker.domain.article.domain.entity.Comment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentListItem {

    private int commentNumber;
    private String writeDatetime;
    private String content;

    public CommentListItem(Comment resultSet){
        this.commentNumber = resultSet.getCommentNumber();
        this.writeDatetime = resultSet.getWriteDatetime();
        this.content = resultSet.getContent();
    }

    public static List<CommentListItem> copyList( List<Comment> resultSet){
        List<CommentListItem> list = new ArrayList<>();
        for(Comment reultSet: resultSet){
            CommentListItem commentListItem = new CommentListItem(reultSet);
            list.add(commentListItem);
        }
        return list;
    }
}
