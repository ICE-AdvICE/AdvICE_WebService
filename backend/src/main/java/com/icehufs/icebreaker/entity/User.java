package com.icehufs.icebreaker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.icehufs.icebreaker.dto.request.auth.SignUpRequestDto;
import com.icehufs.icebreaker.dto.request.user.PatchUserPassRequestDto;
import com.icehufs.icebreaker.dto.request.user.PatchUserRequestDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Getter
@Table(name = "user")
public class User {
    @Id
    @Column(name = "user_email")
    private String email;

    @Column(name = "user_student_num")
    private String studentNum;

    @Column(name = "user_password")
    private String password;

    @Column(name = "user_name")
    private String name;

    public void patchUser(PatchUserRequestDto dto){
        this.studentNum = dto.getStudentNum();
        this.name = dto.getName();
    }

    public void patchUserPass(PatchUserPassRequestDto dto){
        this.password = dto.getPassword();
    }

    public User(SignUpRequestDto dto) {
        this.email = dto.getEmail();
        this.studentNum = dto.getStudentNum();
        this.password = dto.getPassword();
        this.name = dto.getName();

    }


}

