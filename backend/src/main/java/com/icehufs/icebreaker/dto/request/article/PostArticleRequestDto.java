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
    private String article_title;

    @NotBlank
    private String article_content;

    @NotNull
    private int category;

}
