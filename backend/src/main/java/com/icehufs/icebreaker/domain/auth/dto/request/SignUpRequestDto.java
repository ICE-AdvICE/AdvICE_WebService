package com.icehufs.icebreaker.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignUpRequestDto {

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min=8, max=20)
    private String password;

    @NotBlank
    private String studentNum;

    @NotBlank
    private String name;

    public void setEmail(String email) {
        this.email = email + "@hufs.ac.kr";
    }
}