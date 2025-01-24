package com.icehufs.icebreaker.domain.article.repository;

import java.util.List;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.domain.article.domain.entity.Comment;


@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findByArticleNumOrderByWriteDatetimeDesc(Integer articleNum);

    @Transactional
    void deleteByArticleNum(Integer articleNum);

    Comment findByCommentNumber(Integer commentNumber);
}



