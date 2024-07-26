package com.icehufs.icebreaker.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private int classNum;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_student_num", nullable = false)
    private String userStudentNum;

    @Column(name = "attendance", nullable = false)
    private String attendance;


    public CodingZoneRegisterEntity(String email, String name, String user_student_num, Integer classNum) {
        this.classNum = classNum;
        this.userEmail = email;
        this.userName = name;
        this.userStudentNum = user_student_num;
        this.attendance = "0";
    }
}
