package com.icehufs.icebreaker.domain.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GiveUserBanRequestDto {
    //@NotBlank
    //private String email; 익명보장을 위해 글 작성자 메일을 아예 노출 x

    @NotBlank
    private String banDuration;

    @NotBlank
    private String banReason;
}
