package com.icehufs.icebreaker.entity;

public enum BanReason {
    // 스팸성 게시물이나 댓글 작성
    SPAM,
    // 다른 사용자에 대한 괴롭힘 또는 괴롭히는 내용의 게시물 작성
    HARASSMENT,
    //부적절한 내용 게시
    INAPPROPRIATE_CONTENT,
    // 혐오 발언
    HATE_SPEECH,
    // 폭력적인 내용
    VIOLENCE,
    // 허위 정보 유포
    FALSE_INFORMATION,
    // 다른 사람을 사칭
    IMPERSONATION,
    // 사기 행위
    SCAM,
    // 커뮤니티 규칙 위반
    VIOLATION_OF_RULES,
    // 기타 사유
    OTHER
}
