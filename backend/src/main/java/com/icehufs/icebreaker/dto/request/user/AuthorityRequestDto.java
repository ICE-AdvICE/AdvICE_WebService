package com.icehufs.icebreaker.dto.request.user;



import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthorityRequestDto {

    @NotNull
    private int roleAdmin1;

    @NotNull
    private int roleAdmin2;
   
}
