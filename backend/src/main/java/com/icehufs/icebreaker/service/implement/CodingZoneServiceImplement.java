package com.icehufs.icebreaker.service.implement;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.dto.request.codingzone.CodingZoneClassAssignRequestDto;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.codingzone.CodingZoneClassAssignResponseDto;
import com.icehufs.icebreaker.entity.CodingZoneClass;
import com.icehufs.icebreaker.repository.CodingZoneClassRepository;
import com.icehufs.icebreaker.service.CodingZoneService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CodingZoneServiceImplement implements CodingZoneService {

    private final CodingZoneClassRepository codingZoneClassRepository;

    @Override
    public ResponseEntity<? super CodingZoneClassAssignResponseDto> codingzoneClassAssign(CodingZoneClassAssignRequestDto dto, String email){
        try {
            CodingZoneClass codingZoneClassEntity = new CodingZoneClass(dto);
            codingZoneClassRepository.save(codingZoneClassEntity);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return CodingZoneClassAssignResponseDto.success();
    }
    
}
