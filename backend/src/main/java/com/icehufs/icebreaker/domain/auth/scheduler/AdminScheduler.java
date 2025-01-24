package com.icehufs.icebreaker.domain.auth.scheduler;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.icehufs.icebreaker.domain.auth.domain.entity.Authority;
import com.icehufs.icebreaker.domain.auth.repostiory.AuthorityRepository;

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
        List<Authority> users = authorityRepository.findAll(); // 모든 사용자를 반환

        for (Authority authority : users) {
            if (!"NULL".equals(authority.getRoleAdmin1())) { // 익명게시판 운영자 권한을 가진 사용자를 검사
                if (authority.getGivenDateAdmin1() != null && ChronoUnit.MONTHS.between(authority.getGivenDateAdmin1(), now) >= 10) {
                    authority.setRoleAdmin1("NULL");
                    authority.setGivenDateAdmin1(null);
                    authorityRepository.save(authority);
                }
            }
            
            if (!"NULL".equals(authority.getRoleAdminC1())) { //코딩존 과목1 조교 권한을 가진 사용자를 검사
                if (authority.getGivenDateAdminC() != null && ChronoUnit.MONTHS.between(authority.getGivenDateAdminC(), now) >= 4) {
                    authority.setRoleAdminC1("NULL");
                    authority.setGivenDateAdminC(null);
                    authorityRepository.save(authority);
                }
            }

            if (!"NULL".equals(authority.getRoleAdminC2())) { //코딩존 과목2 조교 권한을 가진 사용자를 검사
                if (authority.getGivenDateAdminC() != null && ChronoUnit.MONTHS.between(authority.getGivenDateAdminC(), now) >= 4) {
                    authority.setRoleAdminC2("NULL");
                    authority.setGivenDateAdminC(null);
                    authorityRepository.save(authority);
                }
            }
        }
    }

}