package com.icehufs.icebreaker.domain.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.icehufs.icebreaker.domain.codingzone.dto.response.PutAttendanceResponseDto;
import com.icehufs.icebreaker.domain.codingzone.service.CodingZoneService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin-c1") //코딩존1 조교 권한 API 주소
@RequiredArgsConstructor
public class CodingZoneClass1Controller {

    private final CodingZoneService codingzoneService;

    @PutMapping("/attendance/{registNum}") // 코딩존1 수업을 예약한 학생을 출석/결석 처리 API
    public ResponseEntity<? super PutAttendanceResponseDto> putAttend(
        @PathVariable Integer registNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PutAttendanceResponseDto> response = codingzoneService.putAttend(registNum, email);
        return response;
    }
}
