package com.icehufs.icebreaker.service;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.dto.request.codingzone.*;
import com.icehufs.icebreaker.dto.response.codingzone.*;
import java.util.List;

public interface CodingZoneService {
    ResponseEntity<? super CodingZoneClassAssignResponseDto> codingzoneClassAssign(CodingZoneClassAssignRequestDto dto, String email);
    ResponseEntity<? super AuthorityExistResponseDto> authExist(String email);
    ResponseEntity<? super GroupInfUpdateResponseDto> uploadInf(List<GroupInfUpdateRequestDto> dto, String email);
}
