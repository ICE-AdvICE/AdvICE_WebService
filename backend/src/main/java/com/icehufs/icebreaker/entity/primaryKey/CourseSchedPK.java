package com.icehufs.icebreaker.entity.primaryKey;

import java.io.Serializable;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseSchedPK implements Serializable{

    @Column(name = "class_num")
    private int classNum;

    @Column(name = "user_email")
    private String userEmail;

}
