package com.icehufs.icebreaker.domain.codingzone.domain.vo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.ArrayList;
import com.icehufs.icebreaker.domain.membership.domain.entity.User;


@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CodingZoneAssitantListItem {

    private String email;
    private String studentNum;
    private String name;

    public CodingZoneAssitantListItem(User user){
        this.email = user.getEmail();
        this.studentNum = user.getStudentNum();
        this.name = user.getName();
    }

    public static List<CodingZoneAssitantListItem> getList(List<User> users){
        List<CodingZoneAssitantListItem> list = new ArrayList<>();
        for (User user: users){
            CodingZoneAssitantListItem codingZoneAssitantListItem = new CodingZoneAssitantListItem(user);
            list.add(codingZoneAssitantListItem);
        }
        return list;
    }
}
