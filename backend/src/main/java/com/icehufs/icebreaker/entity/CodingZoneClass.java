package com.icehufs.icebreaker.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.icehufs.icebreaker.dto.request.codingzone.CodingZoneClassAssignRequestDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Entity(name = "codingzoneclass")
@Table(name = "codingzoneclass")
public class CodingZoneClass {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_num")
    private int classNum;

    @Column(name = "assistant_name")
    private String assistantName;

    @Column(name = "class_time")
    private String classTime;

    @Column(name = "class_date")
    private String classDate;

    @Column(name = "maximum_number")
    private int maximumNumber;

    @Column(name = "category")
    private String category;

    public CodingZoneClass(CodingZoneClassAssignRequestDto dto) {
        this.assistantName = dto.getAssistantName();
        this.classTime = dto.getClassTime();
        this.classDate = dto.getClassDate();
        this.maximumNumber = dto.getMaximumNumber();
        this.category = dto.getCategory();
    }
}
