package com.icehufs.icebreaker.domain.auth.service;

import java.time.Duration;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
	private final StringRedisTemplate redisTemplate;
	private static final String REFRESH_TOKEN_PREFIX = "RT:";
	private static final Duration REFRESH_TOKEN_VALIDITY = Duration.ofSeconds(30);

	public void storeRefreshToken(String email, String refreshToken) {
		redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + email, refreshToken, REFRESH_TOKEN_VALIDITY);
	}

	private String getRefreshToken(String email) {
		return redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + email);
	}

	public void deleteRefreshToken(String email) {
		redisTemplate.delete(REFRESH_TOKEN_PREFIX + email);
	}

	public boolean vaildateRefreshToken(String email, String refreshToken) {
		String storedRefreshToken = getRefreshToken(email);
		if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
			return false;
		}
		return true;
	}
}
