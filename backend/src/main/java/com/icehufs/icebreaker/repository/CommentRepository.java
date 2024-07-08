package com.icehufs.icebreaker.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.CommentEntity;


@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {

    @Query(
        value=
        """
        SELECT\
            C.comment_number AS commentNumber, \
            C.write_datetime AS writeDatetime, \
            C.content AS content \
        FROM comment AS C \
        WHERE C.article_num = ?1 \
        ORDER BY writeDatetime DESC\
        """,
        nativeQuery = true
    )
    List<GetCommentListReultSet> getCommentList(Integer articleNum);

    @Transactional
    void deleteByArticleNum(Integer articleNum);

    CommentEntity findByCommentNumber(Integer commentNumber);
}
