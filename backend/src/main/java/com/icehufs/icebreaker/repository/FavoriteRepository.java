package com.icehufs.icebreaker.repository;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.FavoriteEntity;
import com.icehufs.icebreaker.entity.primaryKey.FavoritePk;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePk> {

    FavoriteEntity findByArticleNumAndUserEmail(Integer articleNum, String userEmail);

    @Transactional
    void deleteByArticleNum(Integer articleNum);

}
