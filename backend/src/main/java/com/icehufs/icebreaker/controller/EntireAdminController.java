package com.icehufs.icebreaker.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icehufs.icebreaker.dto.request.codingzone.*;
import com.icehufs.icebreaker.dto.response.codingzone.*;
import com.icehufs.icebreaker.service.CodingZoneService;
import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin") // 'ICEbreaker' 코딩존 수업 등록 및 권한 부여 가능한 권한(과사조교) API 주소
@RequiredArgsConstructor
public class EntireAdminController {

    private final CodingZoneService codingzoneService;

    @PostMapping("/upload-codingzone") // 수업 리스트 등록 API
    public ResponseEntity<? super CodingZoneClassAssignResponseDto> CodingZoneClassAssignResponse(
        @RequestBody @Valid List<CodingZoneClassAssignRequestDto> requestBody,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super CodingZoneClassAssignResponseDto> response = codingzoneService.codingzoneClassAssign(requestBody, email);
        return response;
    }

    @PostMapping("/upload-group") //특정 (A/B)조 정보 등록 API
    public ResponseEntity<? super GroupInfUpdateResponseDto> uploadInf(
        @RequestBody @Valid List<GroupInfUpdateRequestDto> requestBody,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super GroupInfUpdateResponseDto> response = codingzoneService.uploadInf(requestBody, email);
        return response;
    }

    @GetMapping("/get-group/{groupId}") //특정 (A/B)조 정보 반환 API
    public ResponseEntity<? super GetListOfGroupInfResponseDto> getList(
        @PathVariable String groupId,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super GetListOfGroupInfResponseDto> response = codingzoneService.getList(groupId, email);
        return response;
    }

    @PatchMapping("/patch-group") //특정 (A/B)조 정보 수정 API
    public ResponseEntity<? super GroupInfUpdateResponseDto> patchInf(
        @RequestBody @Valid List<PatchGroupInfRequestDto> requestBody,
        @AuthenticationPrincipal String email
    ) {
        ResponseEntity<? super GroupInfUpdateResponseDto> response = codingzoneService.patchInf(requestBody, email);
        return response;
    }

    @DeleteMapping("/delete-class/{classNum}") //등록된 특정 수업 삭제 API
    public ResponseEntity<? super DeleteClassResponseDto> deleteClass(
        @PathVariable Integer classNum,
        @AuthenticationPrincipal String email

    ){
        ResponseEntity<? super DeleteClassResponseDto> response = codingzoneService.deleteClass(classNum, email);
        return response;
    }

    @GetMapping("/student-list") // 해당학기에 출/결한 모든 학생을 리스트로 반환 API
    public ResponseEntity<? super GetCodingZoneStudentListResponseDto> getStudentList(
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super GetCodingZoneStudentListResponseDto> response = codingzoneService.getStudentList(email);
        return response;
    } 

    @DeleteMapping("/delete-allinf") // 코딩존 관련 모든 정보 초기화(코딩존 조교 권한 박할까지) API
    public ResponseEntity<? super DeleteAllInfResponseDto> deleteAll(
        @AuthenticationPrincipal String email

    ){
        ResponseEntity<? super DeleteAllInfResponseDto> response = codingzoneService.deleteAll(email);
        return response;
    }


    @PatchMapping("/give-auth") //사용자 특정 권한 부여 API
    public ResponseEntity<? super GiveAuthResponseDto> giveAuth(
        @RequestBody @Valid HandleAuthRequestDto requestBody,
        @AuthenticationPrincipal String email
    ) {
        ResponseEntity<? super GiveAuthResponseDto> response = codingzoneService.giveAuth(email, requestBody);
        return response;
    }

    @PatchMapping("/deprive-auth") //사용자 특정 권한 박탈 API
    public ResponseEntity<? super DepriveAuthResponseDto> depriveAuth(
        @RequestBody @Valid HandleAuthRequestDto requestBody,
        @AuthenticationPrincipal String email
    ) {
        ResponseEntity<? super DepriveAuthResponseDto> response = codingzoneService.depriveAuth(email, requestBody);
        return response;
    }
}
