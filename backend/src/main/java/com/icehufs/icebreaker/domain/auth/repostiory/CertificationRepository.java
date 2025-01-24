package com.icehufs.icebreaker.domain.auth.repostiory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.domain.auth.domain.entity.Certification;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, String> {

    Certification findByUserEmail(String userEmail);
    
}
