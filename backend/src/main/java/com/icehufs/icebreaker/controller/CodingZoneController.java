package com.icehufs.icebreaker.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.icehufs.icebreaker.service.CodingZoneService;

import com.icehufs.icebreaker.dto.response.codingzone.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CodingZoneController {
    private final CodingZoneService codingzoneService;
 
    @GetMapping("/auth-exist")
    public ResponseEntity<? super AuthorityExistResponseDto> authExist(
    @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super AuthorityExistResponseDto> response = codingzoneService.authExist(email);
        return response;
    }
}
