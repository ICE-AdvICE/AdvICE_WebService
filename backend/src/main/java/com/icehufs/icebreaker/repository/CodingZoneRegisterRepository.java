package com.icehufs.icebreaker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.CodingZoneRegisterEntity;
import java.util.List;

@Repository
public interface CodingZoneRegisterRepository extends JpaRepository<CodingZoneRegisterEntity, Integer> {
    CodingZoneRegisterEntity findByClassNumAndUserEmail(Integer classNum, String userEmail);
    CodingZoneRegisterEntity findByRegistrationId(Integer registrationId);
    List<CodingZoneRegisterEntity> findByGrade(int grade);
    List<CodingZoneRegisterEntity> findByUserEmail(String userEmail);
    List<CodingZoneRegisterEntity> findAllByOrderByUserStudentNumAsc();

}