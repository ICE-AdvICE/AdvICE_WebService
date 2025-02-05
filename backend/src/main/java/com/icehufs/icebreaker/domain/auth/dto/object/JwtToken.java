package com.icehufs.icebreaker.domain.auth.dto.object;

public record JwtToken(
	String accessToken,
	String refreshToken
) {}