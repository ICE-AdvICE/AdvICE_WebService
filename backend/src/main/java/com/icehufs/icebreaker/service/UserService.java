package com.icehufs.icebreaker.service;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.dto.request.user.*;
import com.icehufs.icebreaker.dto.response.user.*;


public interface UserService {

    ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);
    ResponseEntity<? super PatchUserResponseDto> patchUser(PatchUserRequestDto dto, String email);
    ResponseEntity<? super PatchUserPassResponseDto> patchUserPass(PatchUserPassRequestDto dto);
    ResponseEntity<? super DeleteUserResponseDto> deleteUser(String email);
    ResponseEntity<? super AuthorityResponseDto> giveAuthority(AuthorityRequestDto dto, String email);
    ResponseEntity<? super Authority1ExistResponseDto> auth1Exist(String email);
}

