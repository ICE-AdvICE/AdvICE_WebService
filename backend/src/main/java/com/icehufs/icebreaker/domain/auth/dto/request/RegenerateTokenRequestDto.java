package com.icehufs.icebreaker.domain.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RegenerateTokenRequestDto(
	@NotBlank(message = "RT는 필수로 전달해야합니다.")
	String refreshToken
) {}
