package com.icehufs.icebreaker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.AuthorityEntity;
import java.util.List;


@Repository
public interface AuthorityRepository extends JpaRepository<AuthorityEntity, String> {
        AuthorityEntity findByEmail(String email);
        List<AuthorityEntity> findByRoleAdminC1(String roleAdminC1);
        List<AuthorityEntity> findByRoleAdminC2(String roleAdminC2);

}