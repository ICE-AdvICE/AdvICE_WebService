package com.icehufs.icebreaker.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import com.icehufs.icebreaker.service.CodingZoneService;

import com.icehufs.icebreaker.dto.response.codingzone.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/coding-zone")
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

    @PostMapping("/reserve-class/{classNum}")
    public ResponseEntity<? super CodingZoneRegisterResponseDto> classRegist(
        @PathVariable Integer classNum,
        @AuthenticationPrincipal String email
        ){
            ResponseEntity<? super CodingZoneRegisterResponseDto> response = codingzoneService.classRegist(classNum, email);
            return response;
        }
    
    @DeleteMapping("/cence-class/{classNum}")
    public ResponseEntity<? super CodingZoneCanceResponseDto> classCence(
        @PathVariable Integer classNum,
        @AuthenticationPrincipal String email
        ){
            ResponseEntity<? super CodingZoneCanceResponseDto> response = codingzoneService.classCance(classNum, email);
            return response;
        }


}
