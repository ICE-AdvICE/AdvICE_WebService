package com.icehufs.icebreaker.dto.object;

import com.icehufs.icebreaker.entity.CodingZoneClass;
import com.icehufs.icebreaker.entity.CodingZoneRegisterEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReservedClassListItem {

    private Integer registrationId;
    private String userStudentNum;
    private String userName;
    private String userEmail;
    private String className;
    private int grade;
    private String classTime;
    private String assistantName;
    private String attendance;

    public ReservedClassListItem(ReservedClassListItem other){
        this.className = other.className;
        this.registrationId = other.registrationId;
        this.grade = other.grade;
        this.classTime = other.classTime;
        this.assistantName = other.assistantName;
        this.attendance = other.attendance;
        this.userStudentNum = other.userStudentNum;
        this.userName = other.userName;
        this.userEmail = other.userEmail;
    }

    public ReservedClassListItem(CodingZoneClass codingZoneClass, CodingZoneRegisterEntity codingZoneRegisterEntity){
        this.className = codingZoneClass.getClassName();
        this.registrationId = codingZoneRegisterEntity.getRegistrationId();
        this.grade = codingZoneRegisterEntity.getGrade();
        this.classTime = codingZoneClass.getClassTime();
        this.assistantName = codingZoneClass.getAssistantName();
        this.attendance = codingZoneRegisterEntity.getAttendance();
        this.userStudentNum = codingZoneRegisterEntity.getUserStudentNum();
        this.userName = codingZoneRegisterEntity.getUserName();
        this.userEmail = codingZoneRegisterEntity.getUserEmail();
    }

    public static List<ReservedClassListItem> getList(List<ReservedClassListItem> reservedClassListItems) {
        List<ReservedClassListItem> list = new ArrayList<>();
        for (ReservedClassListItem item : reservedClassListItems) {
            list.add(new ReservedClassListItem(item));
        }
        return list;
    }


    
}
