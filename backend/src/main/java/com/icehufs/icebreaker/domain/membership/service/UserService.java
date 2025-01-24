package com.icehufs.icebreaker.domain.membership.service;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.domain.membership.dto.request.AuthorityRequestDto;
import com.icehufs.icebreaker.domain.membership.dto.request.PatchUserPassRequestDto;
import com.icehufs.icebreaker.domain.membership.dto.request.PatchUserRequestDto;
import com.icehufs.icebreaker.domain.membership.dto.response.Authority1ExistResponseDto;
import com.icehufs.icebreaker.domain.membership.dto.response.AuthorityResponseDto;
import com.icehufs.icebreaker.domain.membership.dto.response.DeleteUserResponseDto;
import com.icehufs.icebreaker.domain.membership.dto.response.GetSignInUserResponseDto;
import com.icehufs.icebreaker.domain.membership.dto.response.PatchUserPassResponseDto;
import com.icehufs.icebreaker.domain.membership.dto.response.PatchUserResponseDto;

public interface UserService {

    ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);
    ResponseEntity<? super PatchUserResponseDto> patchUser(PatchUserRequestDto dto, String email);
    ResponseEntity<? super PatchUserPassResponseDto> patchUserPass(PatchUserPassRequestDto dto);
    ResponseEntity<? super DeleteUserResponseDto> deleteUser(String email);
    ResponseEntity<? super AuthorityResponseDto> giveAuthority(AuthorityRequestDto dto, String email);
    ResponseEntity<? super Authority1ExistResponseDto> auth1Exist(String email);
}

