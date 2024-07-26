package com.icehufs.icebreaker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.CodingZoneRegisterEntity;

@Repository
public interface CodingZoneRegisterRepository extends JpaRepository<CodingZoneRegisterEntity, Integer> {
    CodingZoneRegisterEntity findByClassNumAndUserEmail(Integer classNum, String userEmail);
}