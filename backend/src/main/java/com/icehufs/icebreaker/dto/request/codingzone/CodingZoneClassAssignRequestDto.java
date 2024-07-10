package com.icehufs.icebreaker.dto.request.codingzone;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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
