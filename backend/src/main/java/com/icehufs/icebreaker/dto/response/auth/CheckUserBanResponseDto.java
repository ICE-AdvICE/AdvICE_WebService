package com.icehufs.icebreaker.dto.response.auth;

import java.time.LocalDateTime;

import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.entity.BanDuration;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;

@Data
@AllArgsConstructor
public class CheckUserBanResponseDto extends ResponseDto{
    private String email;
    private BanDuration banDuration;
    private LocalDateTime banStartTime;

    public static ResponseEntity<CheckUserBanResponseDto> success(String email, BanDuration banDuration, LocalDateTime banStartTime) {
        return ResponseEntity.ok(new CheckUserBanResponseDto(email, banDuration, banStartTime));
    }

    public static ResponseEntity<? super CheckUserBanResponseDto> notBanned() {
        return ResponseEntity.status(404).body(new CheckUserBanResponseDto(null, null, null));
    }
}
