package com.icehufs.icebreaker.domain.article.dto.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.icehufs.icebreaker.domain.article.domain.entity.ArticleCategoryEnum;

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
    @Enumerated(EnumType.ORDINAL)
    private ArticleCategoryEnum category;

}
