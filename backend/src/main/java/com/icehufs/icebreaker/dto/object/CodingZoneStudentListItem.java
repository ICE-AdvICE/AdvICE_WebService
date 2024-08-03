package com.icehufs.icebreaker.dto.object;

import com.icehufs.icebreaker.entity.CodingZoneClass;
import com.icehufs.icebreaker.entity.CodingZoneRegisterEntity;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CodingZoneStudentListItem {

    private Integer registrationId;
    private String userStudentNum;
    private String userName;
    private String userEmail;
    private String className;
    private String classDate;
    private String classTime;
    private String assistantName;
    private String attendance;

    public CodingZoneStudentListItem(CodingZoneStudentListItem other){
        this.className = other.className;
        this.registrationId = other.registrationId;
        this.classDate = other.classDate;
        this.classTime = other.classTime;
        this.assistantName = other.assistantName;
        this.attendance = other.attendance;
        this.userStudentNum = other.userStudentNum;
        this.userName = other.userName;
        this.userEmail = other.userEmail;
    }

    public CodingZoneStudentListItem(CodingZoneClass codingZoneClass, CodingZoneRegisterEntity codingZoneRegisterEntity){
        this.className = codingZoneClass.getClassName();
        this.registrationId = codingZoneRegisterEntity.getRegistrationId();
        this.classDate = codingZoneClass.getClassDate();
        this.classTime = codingZoneClass.getClassTime();
        this.assistantName = codingZoneClass.getAssistantName();
        this.attendance = codingZoneRegisterEntity.getAttendance();
        this.userStudentNum = codingZoneRegisterEntity.getUserStudentNum();
        this.userName = codingZoneRegisterEntity.getUserName();
        this.userEmail = codingZoneRegisterEntity.getUserEmail();
    }

    public static List<CodingZoneStudentListItem> getList(List<CodingZoneStudentListItem> codingZoneStudentListItems) {
        List<CodingZoneStudentListItem> list = new ArrayList<>();
        for (CodingZoneStudentListItem item : codingZoneStudentListItems) {
            list.add(new CodingZoneStudentListItem(item));
        }
        return list;
    }
    
}
