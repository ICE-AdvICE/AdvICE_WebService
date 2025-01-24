package com.icehufs.icebreaker.domain.auth.repostiory;

import com.icehufs.icebreaker.domain.auth.domain.entity.UserBan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBanRepository extends JpaRepository<UserBan, Long> {
    UserBan findByEmail(String email);
    boolean existsByEmail(String email);
}
