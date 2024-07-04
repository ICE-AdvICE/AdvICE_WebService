package com.icehufs.icebreaker.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.CodingZoneClass;



@Repository
public interface CodingZoneClassRepository extends JpaRepository<CodingZoneClass, Integer> {
    
    // boolean existsByArticleNum(Integer articleNum); // 정확한 필드 이름을 사용
    // Article findByArticleNum(Integer articleNum);   // 정확한 필드 이름을 사용

}
