package com.icehufs.icebreaker.domain.membership.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatchUserRequestDto {
    
    @NotBlank
    private String studentNum;

    @NotBlank
    private String name;

}
