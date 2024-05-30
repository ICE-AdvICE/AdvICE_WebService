package com.icehufs.icebreaker.repository;

import com.icehufs.icebreaker.entity.CertificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationRepository extends JpaRepository<CertificationEntity, String> {

    CertificationEntity findByUserEmail(String userEmail);
}
