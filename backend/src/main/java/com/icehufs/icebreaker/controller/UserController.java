package com.icehufs.icebreaker.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icehufs.icebreaker.dto.request.user.*;
import com.icehufs.icebreaker.dto.response.user.*;
import com.icehufs.icebreaker.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser (
        @AuthenticationPrincipal String email //확인하고자하는 유저의 토큰 유효성 확인 후 유저의 메일 반환
    ){
        ResponseEntity<? super GetSignInUserResponseDto> response = userService.getSignInUser(email);
        return response;
    }

    @PatchMapping("")
    public ResponseEntity<? super PatchUserResponseDto> patchUser(
        @RequestBody @Valid PatchUserRequestDto requestBody,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PatchUserResponseDto> response = userService.patchUser(requestBody, email);
        return response;
    }

    @PatchMapping("/password")
    public ResponseEntity<? super PatchUserPassResponseDto> patchUserPass(
        @RequestBody @Valid PatchUserPassRequestDto requestBody){
        ResponseEntity<? super PatchUserPassResponseDto> response = userService.patchUserPass(requestBody);
        return response;
    }

    @DeleteMapping("")
    public ResponseEntity<? super DeleteUserResponseDto> deleteUser(
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super DeleteUserResponseDto> response = userService.deleteUser(email);
        return response;
    }

    @PatchMapping("/authority")
    public ResponseEntity<? super AuthorityResponseDto> giveAuthority(
        @RequestBody @Valid AuthorityRequestDto requestBody,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super AuthorityResponseDto> response = userService.giveAuthority(requestBody, email);
        return response;
    }

    @GetMapping("/auth1-exist")
    public ResponseEntity<? super Authority1ExistResponseDto> auth1Exist(
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super Authority1ExistResponseDto> response = userService.auth1Exist(email);
        return response;
    }

    
}
