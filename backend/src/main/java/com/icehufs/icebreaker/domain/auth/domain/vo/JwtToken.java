package com.icehufs.icebreaker.domain.auth.domain.vo;

public record JwtToken(
	String accessToken,
	String refreshToken
) {}