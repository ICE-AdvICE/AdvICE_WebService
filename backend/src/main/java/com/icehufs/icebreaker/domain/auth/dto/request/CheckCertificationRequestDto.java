package com.icehufs.icebreaker.domain.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class CheckCertificationRequestDto {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String certificationNumber;

    public void setEmail(String email) {
        this.email = email + "@hufs.ac.kr";
    }

}
