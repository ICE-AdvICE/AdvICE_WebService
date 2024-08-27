package com.icehufs.icebreaker.repository;

import java.util.List;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.CommentEntity;


@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {

    List<CommentEntity> findByArticleNumOrderByWriteDatetimeDesc(Integer articleNum);

    @Transactional
    void deleteByArticleNum(Integer articleNum);

    CommentEntity findByCommentNumber(Integer commentNumber);
}
