package com.icehufs.icebreaker.dto.request.auth;

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

    private Long id;

    @NotBlank
    private String studentNum;

    @NotBlank @Size(min=8, max=20)
    private String password;

    @NotBlank
    private String name;

    @NotBlank @Email
    private String email;

    
}