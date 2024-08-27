package com.icehufs.icebreaker.dto.request.article;

import com.icehufs.icebreaker.entity.ArticleCategoryEnum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    private ArticleCategoryEnum category;
}
