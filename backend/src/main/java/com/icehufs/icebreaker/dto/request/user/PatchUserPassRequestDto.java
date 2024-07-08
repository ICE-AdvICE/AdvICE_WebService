package com.icehufs.icebreaker.dto.request.user;

import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatchUserPassRequestDto {

    @NotBlank
    private String password;

    @NotBlank
    private String email;

    public void setEmail(String email) {
        this.email = email + "@hufs.ac.kr";
    }
}
