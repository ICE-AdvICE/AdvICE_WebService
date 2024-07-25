package com.icehufs.icebreaker.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.GroupInfEntity;



@Repository
public interface GroupInfRepository extends JpaRepository<GroupInfEntity, Integer> {
    List<GroupInfEntity> findByGroupId(String groupId);
    GroupInfEntity findByClassNum(int classNum);
    void deleteByGroupId(String groupId);
    
    
    
}