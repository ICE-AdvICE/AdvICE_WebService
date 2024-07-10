package com.icehufs.icebreaker.dto.request.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Getter
@NoArgsConstructor
public class EmailCertificationRequestDto {

    @Email
    @NotBlank
    private String email;

    public void setEmail(String email) {
        this.email = email + "@hufs.ac.kr";
    }
}
    