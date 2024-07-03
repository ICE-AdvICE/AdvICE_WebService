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
}
