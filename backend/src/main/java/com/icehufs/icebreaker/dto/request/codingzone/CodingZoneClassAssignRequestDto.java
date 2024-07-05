package com.icehufs.icebreaker.dto.request.codingzone;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CodingZoneClassAssignRequestDto {

    @NotBlank
    private String assistantName;

    @NotBlank
    private String classTime;

    @NotBlank
    private String classDate;

    @NotNull
    @Min(1)
    private Integer maximumNumber;

    @NotBlank
    private String category;
}
