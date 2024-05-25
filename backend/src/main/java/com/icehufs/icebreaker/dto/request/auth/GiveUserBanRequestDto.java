package com.icehufs.icebreaker.dto.request.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class GiveUserBanRequestDto {
    @NotBlank
    private String email;

    @NotBlank
    private String banDuration;
}
