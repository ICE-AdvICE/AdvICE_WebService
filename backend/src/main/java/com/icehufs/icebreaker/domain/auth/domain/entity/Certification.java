package com.icehufs.icebreaker.domain.auth.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="certification")
@Table(name="certification")
public class Certification {

    @Id
    @Column(name="user_email")
    private String userEmail;

    private String certificationNumber;

}
