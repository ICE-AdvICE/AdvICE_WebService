package com.icehufs.icebreaker.domain.auth.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Entity(name = "authority")
@Table(name = "authority")
public class Authority {

    @Id
    @Column(name = "email")
    private String email;

    //일반 사용자
    @Column(name = "role_user")
    private String roleUser;

    //익명게시판 운영자 권한
    @Column(name = "role_admin1")
    private String roleAdmin1;

    // 'ICEbreaker' 코딩존 수업 등록 및 권한 부여 가능한 권한 (과사조교)
    @Column(name = "role_admin")
    private String roleAdmin;

    //코딩존 과목1 조교 권한
    @Column(name = "role_admin_c1")
    private String roleAdminC1;

    //코딩존 과목2 조교 권한
    @Column(name = "role_admin_c2")
    private String roleAdminC2;

    @Column(name = "given_date_admin1")
    private LocalDateTime givenDateAdmin1;

    @Column(name = "given_date_admin_c")
    private LocalDateTime givenDateAdminC;

    public Authority(String email){
        this.email = email;
        this.roleUser = "ROLE_USER";
        this.roleAdmin1 = "NULL";
        this.roleAdminC1 = "NULL";
        this.roleAdminC2 = "NULL";
        this.roleAdmin = "NULL";
        this.givenDateAdmin1 = null;
        this.givenDateAdminC = null;
    }

    public void giveAdmin1Auth() {
        this.roleAdmin1 = "ROLE_ADMIN1";
        this.givenDateAdmin1 = LocalDateTime.now();
    }

    public void giveAdminC1Auth() {
        this.roleAdminC1 = "ROLE_ADMINC1";
        this.givenDateAdminC = LocalDateTime.now();
    }

    public void giveAdminC2Auth() {
        this.roleAdminC2 = "ROLE_ADMINC2";
        this.givenDateAdminC = LocalDateTime.now();
    }

    public void giveAdminAuth() {
        this.roleAdmin = "ROLE_ADMIN";
    }

    public void setRoleAdmin1(String roleAdmin1) {
        this.roleAdmin1 = roleAdmin1;
    }

    public void setRoleAdminC1(String roleAdminC1) {
        this.roleAdminC1 = roleAdminC1;
    }

    public void setRoleAdminC2(String roleAdminC2) {
        this.roleAdminC2 = roleAdminC2;
    }

    public void setRoleAdmin(String roleAdmin) {
        this.roleAdmin = roleAdmin;
    }


    public void setGivenDateAdmin1(LocalDateTime givenDateAdmin1) {
        this.givenDateAdmin1 = givenDateAdmin1;
    }

    public void setGivenDateAdminC(LocalDateTime givenDateAdminC) {
        this.givenDateAdminC = givenDateAdminC;
    }
}