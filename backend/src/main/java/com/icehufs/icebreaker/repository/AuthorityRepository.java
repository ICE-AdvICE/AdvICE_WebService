package com.icehufs.icebreaker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icehufs.icebreaker.entity.AuthorityEntity;



@Repository
public interface AuthorityRepository extends JpaRepository<AuthorityEntity, String> {

        AuthorityEntity findByEmail(String email);

}