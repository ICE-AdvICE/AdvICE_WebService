package com.icehufs.icebreaker.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.dto.request.codingzone.CodingZoneClassAssignRequestDto;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.article.CheckOwnOfArticleResponseDto;
import com.icehufs.icebreaker.dto.response.codingzone.CodingZoneClassAssignResponseDto;
import com.icehufs.icebreaker.entity.CodingZoneClass;
import com.icehufs.icebreaker.repository.CodingZoneClassRepository;
import com.icehufs.icebreaker.repository.UserRepository;
import com.icehufs.icebreaker.service.CodingZoneService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CodingZoneServiceImplement implements CodingZoneService {

    private final CodingZoneClassRepository codingZoneClassRepository;
    private final UserRepository userRepository;

    @Override
    public ResponseEntity<? super CodingZoneClassAssignResponseDto> codingzoneClassAssign(CodingZoneClassAssignRequestDto dto, String email){
        try {
            // 사용자 계정이 존재하는지(로그인시간이 초과 됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return CheckOwnOfArticleResponseDto.notExistUser(); 


            CodingZoneClass codingZoneClassEntity = new CodingZoneClass(dto);
            codingZoneClassRepository.save(codingZoneClassEntity);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return CodingZoneClassAssignResponseDto.success();
    }
    
}
