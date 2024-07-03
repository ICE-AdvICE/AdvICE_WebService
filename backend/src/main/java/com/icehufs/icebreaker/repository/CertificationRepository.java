package com.icehufs.icebreaker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.CertificationEntity;

@Repository
public interface CertificationRepository extends JpaRepository<CertificationEntity, String> {

    CertificationEntity findByUserEmail(String userEmail);
}
