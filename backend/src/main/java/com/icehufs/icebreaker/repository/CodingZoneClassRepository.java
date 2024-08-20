package com.icehufs.icebreaker.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.icehufs.icebreaker.entity.CodingZoneClass;



@Repository
public interface CodingZoneClassRepository extends JpaRepository<CodingZoneClass, Integer> {
    
    CodingZoneClass findByClassNum(Integer classNum);  
    List<CodingZoneClass> findByGrade(int grade);
    List<CodingZoneClass> findByGradeAndClassDateBetween(Integer grade, String startDate, String endDate);

}
