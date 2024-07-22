package com.icehufs.icebreaker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.GroupInfEntity;

@Repository
public interface GroupInfRepository extends JpaRepository<GroupInfEntity, Integer> {
}