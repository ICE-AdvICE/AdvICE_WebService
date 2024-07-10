package com.icehufs.icebreaker.entity;

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
public class CertificationEntity {

    @Id
    @Column(name="user_email")
    private String userEmail;

    private String certificationNumber;

}
