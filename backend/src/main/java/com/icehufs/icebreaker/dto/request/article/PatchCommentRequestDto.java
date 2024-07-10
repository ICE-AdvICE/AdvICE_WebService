package com.icehufs.icebreaker.dto.request.article;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatchCommentRequestDto {

    @NotBlank
    private String content;
    
}
