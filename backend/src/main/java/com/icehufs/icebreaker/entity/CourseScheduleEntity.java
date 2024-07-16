package com.icehufs.icebreaker.entity;

import com.icehufs.icebreaker.entity.primaryKey.CourseSchedPK;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "course_schedule")
@Table(name = "course_schedule")
@IdClass(CourseSchedPK.class)
public class CourseScheduleEntity {
    
    @Id
    @Column(name = "class_num")
    private int classNum;

    @Id
    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "attendance")
    private int attendance;

}
