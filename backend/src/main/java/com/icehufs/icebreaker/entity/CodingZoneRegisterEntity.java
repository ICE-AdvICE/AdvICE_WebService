package com.icehufs.icebreaker.entity;

import com.icehufs.icebreaker.dto.request.codingzone.CodingZoneRegisterRequestDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Entity(name = "codingzoneregister")
@Table(name = "codingzoneregister")
public class CodingZoneRegisterEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registration_id")
    private Integer registrationId;

    @Column(name = "class_num")
    private int class_num;

    @Column(name = "user_email")
    private String user_email;

    @Column(name = "user_name", nullable = false)
    private String user_name;

    @Column(name = "user_student_num", nullable = false)
    private String user_student_num;

    @Column(name = "attendance", nullable = false)
    private String attendance;


    public CodingZoneRegisterEntity(CodingZoneRegisterRequestDto dto, String email, String name, String user_student_num) {
        this.class_num = dto.getClassNum();
        this.user_email = email;
        this.user_name = name;
        this.user_student_num = user_student_num;
        this.attendance = "0";
    }
}
