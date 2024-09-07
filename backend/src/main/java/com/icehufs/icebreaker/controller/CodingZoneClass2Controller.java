package com.icehufs.icebreaker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icehufs.icebreaker.dto.response.codingzone.PutAttendanceResponseDto;
import com.icehufs.icebreaker.service.CodingZoneService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin-c2") //코딩존2 조교 권한 API 주소
@RequiredArgsConstructor
public class CodingZoneClass2Controller {
    private final CodingZoneService codingzoneService;

    @PutMapping("/attendance/{registNum}") // 코딩존2 수업을 예약한 학생을 출석/결석 처리 API
    public ResponseEntity<? super PutAttendanceResponseDto> putAttend(
        @PathVariable Integer registNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PutAttendanceResponseDto> response = codingzoneService.putAttend(registNum, email);
        return response;
    }
    
}
