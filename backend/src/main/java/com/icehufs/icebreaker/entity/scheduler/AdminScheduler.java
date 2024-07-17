package com.icehufs.icebreaker.entity.scheduler;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.icehufs.icebreaker.entity.AuthorityEntity;
import com.icehufs.icebreaker.repository.AuthorityRepository;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class AdminScheduler {

    @Autowired
    private AuthorityRepository authorityRepository;

    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정에 실행
    @Transactional
    public void cleanupOldUsers() {
        LocalDateTime now = LocalDateTime.now();
        List<AuthorityEntity> users = authorityRepository.findAll(); // 모든 사용자를 반환

        for (AuthorityEntity authorityEntity : users) {
            if (!"NULL".equals(authorityEntity.getRoleAdmin1())) { // 익명게시판 운영자 권한을 가진 사용자를 검사
                if (authorityEntity.getGivenDateAdmin1() != null && ChronoUnit.MONTHS.between(authorityEntity.getGivenDateAdmin1(), now) >= 10) {
                    authorityEntity.setRoleAdmin1("NULL");
                    authorityEntity.setGivenDateAdmin1(null);
                    authorityRepository.save(authorityEntity);
                }
            }
            
            if (!"NULL".equals(authorityEntity.getRoleAdminC1())) { //코딩존 과목1 조교 권한을 가진 사용자를 검사
                if (authorityEntity.getGivenDateAdminC() != null && ChronoUnit.MONTHS.between(authorityEntity.getGivenDateAdminC(), now) >= 4) {
                    authorityEntity.setRoleAdminC1("NULL");
                    authorityEntity.setGivenDateAdminC(null);
                    authorityRepository.save(authorityEntity);
                }
            }

            if (!"NULL".equals(authorityEntity.getRoleAdminC2())) { //코딩존 과목2 조교 권한을 가진 사용자를 검사
                if (authorityEntity.getGivenDateAdminC() != null && ChronoUnit.MONTHS.between(authorityEntity.getGivenDateAdminC(), now) >= 4) {
                    authorityEntity.setRoleAdminC2("NULL");
                    authorityEntity.setGivenDateAdminC(null);
                    authorityRepository.save(authorityEntity);
                }
            }
        }
    }

}