package com.icehufs.icebreaker.domain.auth.dto.response;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.common.ResponseDto;
import com.icehufs.icebreaker.domain.auth.domain.type.BanDurationEnum;
import com.icehufs.icebreaker.domain.auth.domain.type.BanReasonEnum;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckUserBanResponseDto extends ResponseDto{
    private String email;
    private BanDurationEnum banDuration;
    private LocalDateTime banStartTime;
    private LocalDateTime badEndTime;
    private BanReasonEnum banReason;

    public static ResponseEntity<CheckUserBanResponseDto> success(String email, BanDurationEnum banDuration, LocalDateTime banStartTime, LocalDateTime banEndTime, BanReasonEnum banReason) {
        return ResponseEntity.ok(new CheckUserBanResponseDto(email, banDuration, banStartTime, banEndTime, banReason));
    }

    public static ResponseEntity<? super CheckUserBanResponseDto> notBanned() {
        return ResponseEntity.status(404).body(new CheckUserBanResponseDto(null, null, null, null, null));
    }
}
