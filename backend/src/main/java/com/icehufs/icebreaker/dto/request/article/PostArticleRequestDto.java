package com.icehufs.icebreaker.dto.request.article;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.icehufs.icebreaker.entity.ArticleCategoryEnum;

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
