package com.icehufs.icebreaker.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;

import com.icehufs.icebreaker.dto.request.codingzone.CodingZoneClassAssignRequestDto;
import com.icehufs.icebreaker.dto.request.codingzone.GroupInfUpdateRequestDto;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.article.CheckOwnOfArticleResponseDto;
import com.icehufs.icebreaker.dto.response.codingzone.AuthorityExistResponseDto;
import com.icehufs.icebreaker.dto.response.codingzone.CodingZoneClassAssignResponseDto;
import com.icehufs.icebreaker.dto.response.codingzone.GroupInfUpdateResponseDto;
import com.icehufs.icebreaker.dto.response.user.Authority1ExistResponseDto;
import com.icehufs.icebreaker.entity.AuthorityEntity;
import com.icehufs.icebreaker.entity.CodingZoneClass;
import com.icehufs.icebreaker.entity.GroupInfEntity;
import com.icehufs.icebreaker.repository.AuthorityRepository;
import com.icehufs.icebreaker.repository.CodingZoneClassRepository;
import com.icehufs.icebreaker.repository.GroupInfRepository;
import com.icehufs.icebreaker.repository.UserRepository;
import com.icehufs.icebreaker.service.CodingZoneService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CodingZoneServiceImplement implements CodingZoneService {

    private final CodingZoneClassRepository codingZoneClassRepository;
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final GroupInfRepository groupInfRepository;

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

    @Override
    public ResponseEntity<? super AuthorityExistResponseDto> authExist(String email) {
        try{

            AuthorityEntity authorityEntity = authorityRepository.findByEmail(email);
            if(authorityEntity == null) return AuthorityExistResponseDto.notExistUser();
 
            String admin = authorityEntity.getRoleAdmin();

            if("NULL".equals(admin)){
                return AuthorityExistResponseDto.notAdmin();
            }

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
    }
    return AuthorityExistResponseDto.success();
    }

    public ResponseEntity<? super GroupInfUpdateResponseDto> uploadInf(List<GroupInfUpdateRequestDto> requestBody, String email) {
        try {
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GroupInfUpdateResponseDto.notExistUser();

            for (GroupInfUpdateRequestDto requestDto : requestBody) {
                GroupInfEntity groupInfEntity = new GroupInfEntity(requestDto);
                groupInfRepository.save(groupInfEntity);
            }

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GroupInfUpdateResponseDto.success();
    }

    
    
}
