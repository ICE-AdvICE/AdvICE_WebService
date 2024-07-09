package com.icehufs.icebreaker.service;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.dto.request.user.AuthorityRequestDto;
import com.icehufs.icebreaker.dto.request.user.PatchUserPassRequestDto;
import com.icehufs.icebreaker.dto.request.user.PatchUserRequestDto;
import com.icehufs.icebreaker.dto.response.user.DeleteUserResponseDto;
import com.icehufs.icebreaker.dto.response.user.GetSignInUserResponseDto;
import com.icehufs.icebreaker.dto.response.user.PatchUserPassResponseDto;
import com.icehufs.icebreaker.dto.response.user.PatchUserResponseDto;
import com.icehufs.icebreaker.dto.response.user.AuthorityResponseDto;
import com.icehufs.icebreaker.dto.response.user.Authority1ExistResponseDto;


public interface UserService {

    ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);
    ResponseEntity<? super PatchUserResponseDto> patchUser(PatchUserRequestDto dto, String email);
    ResponseEntity<? super PatchUserPassResponseDto> patchUserPass(PatchUserPassRequestDto dto);
    ResponseEntity<? super DeleteUserResponseDto> deleteUser(String email);
    ResponseEntity<? super AuthorityResponseDto> giveAuthority(AuthorityRequestDto dto, String email);
    ResponseEntity<? super Authority1ExistResponseDto> auth1Exist(String email);
}

