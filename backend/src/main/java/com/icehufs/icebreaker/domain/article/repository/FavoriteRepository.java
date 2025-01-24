package com.icehufs.icebreaker.domain.article.repository;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.domain.article.domain.entity.Favorite;
import com.icehufs.icebreaker.entity.primaryKey.FavoritePk;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, FavoritePk> {

    Favorite findByArticleNumAndUserEmail(Integer articleNum, String userEmail);

    @Transactional
    void deleteByArticleNum(Integer articleNum);

}
