package com.icehufs.icebreaker.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

import com.icehufs.icebreaker.dto.request.codingzone.*;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.article.CheckOwnOfArticleResponseDto;
import com.icehufs.icebreaker.dto.response.codingzone.*;
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
    public ResponseEntity<? super CodingZoneClassAssignResponseDto> codingzoneClassAssign(List<CodingZoneClassAssignRequestDto> dto, String email){
        try {
            // 사용자 계정이 존재하는지(로그인시간이 초과 됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return CheckOwnOfArticleResponseDto.notExistUser(); 

            for (CodingZoneClassAssignRequestDto requestDto : dto) {
                CodingZoneClass codingZoneClassEntity = new CodingZoneClass(requestDto);
                codingZoneClassRepository.save(codingZoneClassEntity);
            }


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

    @Override
    public ResponseEntity<? super GetListOfGroupInfResponseDto> getList(GetListOfGroupInfRequestDto dto, String email) {
        List<GroupInfEntity> groupInfEntities = new ArrayList<>();
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetListOfGroupInfResponseDto.notExistUser();

            groupInfEntities = groupInfRepository.findByGroupId(dto.getGroupId());
        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetListOfGroupInfResponseDto.success(groupInfEntities);
    }

    @Override
    public ResponseEntity<? super GroupInfUpdateResponseDto> patchInf(List<PatchGroupInfRequestDto> dto, String email) {

        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GroupInfUpdateResponseDto.notExistUser();

            //각 수업을 수정
            for (PatchGroupInfRequestDto dtos : dto) {
                GroupInfEntity existingEntity = groupInfRepository.findByClassNum(dtos.getClassNum());
                if (existingEntity != null) {
                    existingEntity.setAssistantName(dtos.getAssistantName());
                    existingEntity.setClassTime(dtos.getClassTime());
                    existingEntity.setWeekDay(dtos.getWeekDay());
                    existingEntity.setGroupId(dtos.getGroupId());
                    existingEntity.setMaximumNumber(dtos.getMaximumNumber());
                    existingEntity.setClassName(dtos.getClassName());
                    groupInfRepository.save(existingEntity);
                }
            }
           
        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GroupInfUpdateResponseDto.success();

    }

    
    
}
