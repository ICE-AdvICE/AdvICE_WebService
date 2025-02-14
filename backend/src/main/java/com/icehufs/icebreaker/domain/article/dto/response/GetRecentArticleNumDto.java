package com.icehufs.icebreaker.domain.article.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseCode;
import com.icehufs.icebreaker.common.ResponseDto;
import com.icehufs.icebreaker.common.ResponseMessage;

import lombok.Getter;

@Getter
public class GetRecentArticleNumDto extends ResponseDto {
	private final long recentArticleNum;
	private GetRecentArticleNumDto(long recentArticleNum){
		super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
		this.recentArticleNum = recentArticleNum;
	}

	public static ResponseEntity<GetRecentArticleNumDto> success(long recentArticleNum) {
		GetRecentArticleNumDto result = new GetRecentArticleNumDto(recentArticleNum);
		return ResponseEntity.status(HttpStatus.OK).body(result);
	}
}
