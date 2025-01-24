package com.icehufs.icebreaker.domain.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.domain.codingzone.domain.entity.GroupInf;



@Repository
public interface GroupInfRepository extends JpaRepository<GroupInf, Integer> {
    List<GroupInf> findByGroupId(String groupId);
    GroupInf findByClassNum(int classNum);
    void deleteByGroupId(String groupId);
    
    
    
}