package com.icehufs.icebreaker.repository;

import com.icehufs.icebreaker.entity.UserBan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBanRepository extends JpaRepository<UserBan, Long> {
    UserBan findByEmail(String email);
}
