package com.icehufs.icebreaker.dto.request.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class CheckCertificationRequestDto {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String certificationNumber;

}
