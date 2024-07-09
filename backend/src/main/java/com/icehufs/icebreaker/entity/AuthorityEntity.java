package com.icehufs.icebreaker.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Entity(name = "authority")
@Table(name = "authority")
public class AuthorityEntity {

    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "role_user")
    private String roleUser;

    @Column(name = "role_admin1")
    private String roleAdmin1;

    @Column(name = "role_admin2")
    private String roleAdmin2;

    @Column(name = "given_date_admin1")
    private LocalDateTime givenDateAdmin1;

    @Column(name = "given_date_admin2")
    private LocalDateTime givenDateAdmin2;

    public AuthorityEntity(String email){
        this.email = email;
        this.roleUser = "ROLE_USER";
        this.roleAdmin1 = "NULL";
        this.roleAdmin2 = "NULL";
        this.givenDateAdmin1 = null;
        this.givenDateAdmin2 = null;
    }

    public void giveAdmin1Auth() {
        this.roleAdmin1 = "ROLE_ADMIN1";
        this.givenDateAdmin1 = LocalDateTime.now();
    }

    public void giveAdmin2Auth() {
        this.roleAdmin2 = "ROLE_ADMIN2";
        this.givenDateAdmin2 = LocalDateTime.now();
    }

    public void setRoleAdmin1(String roleAdmin1) {
        this.roleAdmin1 = roleAdmin1;
    }

    public void setRoleAdmin2(String roleAdmin2) {
        this.roleAdmin2 = roleAdmin2;
    }

    public void setGivenDateAdmin1(LocalDateTime givenDateAdmin1) {
        this.givenDateAdmin1 = givenDateAdmin1;
    }

    public void setGivenDateAdmin2(LocalDateTime givenDateAdmin2) {
        this.givenDateAdmin2 = givenDateAdmin2;
    }
}