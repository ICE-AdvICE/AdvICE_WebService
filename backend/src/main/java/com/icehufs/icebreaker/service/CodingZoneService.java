package com.icehufs.icebreaker.service;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.dto.request.codingzone.CodingZoneClassAssignRequestDto;
import com.icehufs.icebreaker.dto.response.codingzone.CodingZoneClassAssignResponseDto;

public interface CodingZoneService {
    ResponseEntity<? super CodingZoneClassAssignResponseDto> codingzoneClassAssign(CodingZoneClassAssignRequestDto dto, String email);
}
