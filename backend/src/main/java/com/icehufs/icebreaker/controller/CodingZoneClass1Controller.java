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
@RequestMapping("/api/admin-c1") //코딩존 과목1 조교 권한
@RequiredArgsConstructor
public class CodingZoneClass1Controller {

    private final CodingZoneService codingzoneService;

    @PutMapping("/attendance/{registNum}")
    public ResponseEntity<? super PutAttendanceResponseDto> putAttend(
        @PathVariable Integer registNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PutAttendanceResponseDto> response = codingzoneService.putAttend(registNum, email);
        return response;
    }
}
