package com.icehufs.icebreaker.domain.codingzone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.domain.codingzone.domain.entity.CodingZoneRegister;
import java.util.List;

@Repository
public interface CodingZoneRegisterRepository extends JpaRepository<CodingZoneRegister, Integer> {
    CodingZoneRegister findByClassNumAndUserEmail(Integer classNum, String userEmail);
    CodingZoneRegister findByRegistrationId(Integer registrationId);
    List<CodingZoneRegister> findByGrade(int grade);
    List<CodingZoneRegister> findByUserEmail(String userEmail);
    List<CodingZoneRegister> findAllByOrderByUserStudentNumAsc();
}