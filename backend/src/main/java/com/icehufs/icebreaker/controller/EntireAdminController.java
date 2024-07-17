package com.icehufs.icebreaker.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icehufs.icebreaker.dto.request.codingzone.CodingZoneClassAssignRequestDto;
import com.icehufs.icebreaker.dto.response.codingzone.CodingZoneClassAssignResponseDto;
import com.icehufs.icebreaker.service.CodingZoneService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin") // 'ICEbreaker' 코딩존 수업 등록 및 권한 부여 가능한 권한 (과사조교)
@RequiredArgsConstructor
public class EntireAdminController {

    private final CodingZoneService codingzoneService;

    @PostMapping("/upload-codingzone")
    public ResponseEntity<? super CodingZoneClassAssignResponseDto> CodingZoneClassAssignResponse(
        @RequestBody @Valid CodingZoneClassAssignRequestDto requestBody,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super CodingZoneClassAssignResponseDto> response = codingzoneService.codingzoneClassAssign(requestBody, email);
        return response;
    }
    
}
