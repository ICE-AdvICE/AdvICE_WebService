package com.icehufs.icebreaker.domain.article.dto.request;

import com.icehufs.icebreaker.domain.article.domain.entity.ArticleCategoryEnum;

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
