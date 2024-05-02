package com.icehufs.icebreaker.dto.request.article;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostArticleRequestDto {

    @NotBlank
    private String articleTitle;

    @NotBlank
    private String articleContent;

    @NotNull
    private int category;

}
