package com.icehufs.icebreaker.dto.request.article;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PatchArticleRequestDto {

    @NotBlank
    private String articleTitle;

    @NotBlank
    private String articleContent;
}
