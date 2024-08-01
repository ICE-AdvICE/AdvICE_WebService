package com.icehufs.icebreaker.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

import com.icehufs.icebreaker.dto.object.CodingZoneStudentListItem;
import com.icehufs.icebreaker.dto.object.PersAttendManagListItem;
import com.icehufs.icebreaker.dto.request.codingzone.*;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.dto.response.article.CheckOwnOfArticleResponseDto;
import com.icehufs.icebreaker.dto.response.codingzone.*;
import com.icehufs.icebreaker.entity.AuthorityEntity;
import com.icehufs.icebreaker.entity.CodingZoneClass;
import com.icehufs.icebreaker.entity.CodingZoneRegisterEntity;
import com.icehufs.icebreaker.entity.GroupInfEntity;
import com.icehufs.icebreaker.entity.User;
import com.icehufs.icebreaker.repository.AuthorityRepository;
import com.icehufs.icebreaker.repository.CodingZoneClassRepository;
import com.icehufs.icebreaker.repository.CodingZoneRegisterRepository;
import com.icehufs.icebreaker.repository.GroupInfRepository;
import com.icehufs.icebreaker.repository.UserRepository;
import com.icehufs.icebreaker.service.CodingZoneService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CodingZoneServiceImplement implements CodingZoneService {

    private final CodingZoneClassRepository codingZoneClassRepository;
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final GroupInfRepository groupInfRepository;
    private final CodingZoneRegisterRepository codingZoneRegisterRepository;

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
 
            String entireAdmin = authorityEntity.getRoleAdmin();
            String codingC1Admin = authorityEntity.getRoleAdminC1();
            String codingC2Admin = authorityEntity.getRoleAdminC2();

            if(!"NULL".equals(entireAdmin)){
                return AuthorityExistResponseDto.entireAdmin();
            }
            if(!"NULL".equals(codingC1Admin) || !"NULL".equals(codingC2Admin)){
                return AuthorityExistResponseDto.codingAdmin();
            }

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
    }
    return AuthorityExistResponseDto.success();
    }

    @Transactional
    public ResponseEntity<? super GroupInfUpdateResponseDto> uploadInf(List<GroupInfUpdateRequestDto> requestBody, String email) {
        try {
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GroupInfUpdateResponseDto.notExistUser();
    
            // requestBody가 비어있지 않은지 확인하고 첫 번째 요소의 groupId를 사용
            if (requestBody != null && !requestBody.isEmpty()) {
                String groupId = requestBody.get(0).getGroupId();
                groupInfRepository.deleteByGroupId(groupId); // 새로운 정보를 저장하기 전에 기존 (A/B)조의 정보 삭제
    
                for (GroupInfUpdateRequestDto requestDto : requestBody) {
                    GroupInfEntity groupInfEntity = new GroupInfEntity(requestDto);
                    groupInfRepository.save(groupInfEntity);
                }
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
            if(groupInfEntities.isEmpty()) return GetListOfGroupInfResponseDto.noExistArticle();
            
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

    @Override
    public ResponseEntity<? super DeleteClassOfGroupResponseDto> deleteClass(Integer classNum, String email) {
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GroupInfUpdateResponseDto.notExistUser();

            GroupInfEntity groupInfEntity = groupInfRepository.findByClassNum(classNum);
            if (groupInfEntity == null) return DeleteClassOfGroupResponseDto.noExistArticle();

            groupInfRepository.delete(groupInfEntity);

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return DeleteClassOfGroupResponseDto.success();
    }


    @Override
    @Transactional
    public ResponseEntity<? super CodingZoneRegisterResponseDto> classRegist(Integer classNum, String email) {
        try {
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인
            User userEntity = userRepository.findByEmail(email);
            if (userEntity == null) {
                return CodingZoneRegisterResponseDto.notExistUser();
            }
    
            CodingZoneClass codingZoneClass = codingZoneClassRepository.findByClassNum(classNum);
            if (codingZoneClass == null) {
                return CodingZoneRegisterResponseDto.validationFailed(); //발생할 수 없는 예외로 validation으로 처리
            }
    
            CodingZoneRegisterEntity codingZoneRegisterEntity = codingZoneRegisterRepository.findByClassNumAndUserEmail(classNum, email);
            if (codingZoneRegisterEntity != null) {
                return CodingZoneRegisterResponseDto.alreadyReserve();
            }
    
            // 인원 초과 처리
            if (codingZoneClass.getCurrentNumber() >= codingZoneClass.getMaximumNumber()) {
                return CodingZoneRegisterResponseDto.fullClass();
            }
    
            // 신청한 수업 등록
            String userName = userEntity.getName();
            String userStudentNum = userEntity.getStudentNum();
            int grade = codingZoneClass.getGrade();
            CodingZoneRegisterEntity newRegisterEntity = new CodingZoneRegisterEntity(grade, email, userName, userStudentNum, classNum);
            codingZoneRegisterRepository.save(newRegisterEntity);
            codingZoneClass.increaseNum(); // 예약자 수 증가
            codingZoneClassRepository.save(codingZoneClass);
    
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    
        return CodingZoneRegisterResponseDto.success();
    }

    @Override
    @Transactional
    public ResponseEntity<? super CodingZoneCanceResponseDto> classCance(Integer classNum, String email) {
        try {
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인
            User userEntity = userRepository.findByEmail(email);
            if (userEntity == null) {
                return CodingZoneCanceResponseDto.notExistUser();
            }
    
            CodingZoneClass codingZoneClass = codingZoneClassRepository.findByClassNum(classNum);
            if (codingZoneClass == null) {
                return CodingZoneCanceResponseDto.validationFailed(); //발생할 수 없는 예외로 validation으로 처리
            }
    
            //예약하지 않은 수업을 취소하려 할 경우 방지
            CodingZoneRegisterEntity codingZoneRegisterEntity = codingZoneRegisterRepository.findByClassNumAndUserEmail(classNum, email);
            if (codingZoneRegisterEntity == null) {
                return CodingZoneCanceResponseDto.notReserve();
            }
    
            codingZoneRegisterRepository.delete(codingZoneRegisterEntity);
            codingZoneClass.decreaseNum();
            codingZoneClassRepository.save(codingZoneClass);

    
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    
        return CodingZoneCanceResponseDto.success();
    }

    @Override
    @Transactional
    public ResponseEntity<? super PutAttendanceResponseDto> putAttend(Integer registNum, String email) {
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
        boolean existedUser = userRepository.existsByEmail(email);
        if (!existedUser) return PutAttendanceResponseDto.notExistUser();

        CodingZoneRegisterEntity codingZoneRegisterEntity = codingZoneRegisterRepository.findByRegistrationId(registNum);
        if(codingZoneRegisterEntity == null) return PutAttendanceResponseDto.validationFailed();

        // 출석 상태 업데이트
        if ("0".equals(codingZoneRegisterEntity.getAttendance())) { // 결석(미출석) -> 출석
            codingZoneRegisterEntity.putAttend();
        } else {
            codingZoneRegisterEntity.putNotAttend(); // 출석 -> 결석
        }
        codingZoneRegisterRepository.save(codingZoneRegisterEntity);

        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PutAttendanceResponseDto.success();
    }

    @Override
    public ResponseEntity<? super GetListOfCodingZoneClassResponseDto> getClassList(Integer grade, String email) {
        List<CodingZoneClass> classEntities = new ArrayList<>();
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetListOfCodingZoneClassResponseDto.notExistUser();

            if(grade != 1 && grade != 2) return GetListOfCodingZoneClassResponseDto.validationFailed();

            classEntities = codingZoneClassRepository.findByGrade(grade);
            if(classEntities.isEmpty()) return  GetListOfCodingZoneClassResponseDto.noExistArticle();

        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetListOfCodingZoneClassResponseDto.success(classEntities);

        
    }

    @Override
    public ResponseEntity<? super GetCountOfAttendResponseDto> getAttend(Integer grade, String email) {
        Integer NumOfAttend = 0;
        List<CodingZoneRegisterEntity> classEntities = new ArrayList<>();
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetCountOfAttendResponseDto.notExistUser();

            if(grade != 1 && grade != 2) return GetCountOfAttendResponseDto.validationFailed();

            classEntities = codingZoneRegisterRepository.findByGrade(grade);
            if(classEntities.isEmpty()) return GetCountOfAttendResponseDto.success(NumOfAttend);

            for (CodingZoneRegisterEntity entity : classEntities){
                if(entity.getUserEmail().equals(email) && entity.getAttendance().equals("1")){
                    NumOfAttend++;
                }
            }
        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetCountOfAttendResponseDto.success(NumOfAttend);
    }

    @Override
    public ResponseEntity<? super GetPersAttendListItemResponseDto> getPerAttendList(String email) {
        List<PersAttendManagListItem> attendClassEntities = new ArrayList<>();
        List<CodingZoneRegisterEntity> classEntities = new ArrayList<>();
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetPersAttendListItemResponseDto.notExistUser();

            //아직 출/결한 수업이 없을 때
            classEntities = codingZoneRegisterRepository.findByUserEmail(email);
            if(classEntities.isEmpty()) return GetPersAttendListItemResponseDto.noExistArticle();

            for(CodingZoneRegisterEntity codingZoneRegisterEntity: classEntities){
                CodingZoneClass codingZoneClass = codingZoneClassRepository.findByClassNum(codingZoneRegisterEntity.getClassNum());
                PersAttendManagListItem persAttendManagListItem = new PersAttendManagListItem(codingZoneClass, codingZoneRegisterEntity);
                attendClassEntities.add(persAttendManagListItem);
            }
        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetPersAttendListItemResponseDto.success(attendClassEntities);

    }

    @Override
    public ResponseEntity<? super GetCodingZoneStudentListResponseDto> getStudentList(String email) {
        List<CodingZoneStudentListItem> studentList = new ArrayList<>();
        List<CodingZoneRegisterEntity> classEntities = new ArrayList<>();
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetCodingZoneStudentListResponseDto.notExistUser();

            //아직 출/결한 수업이 없을 때
            classEntities = codingZoneRegisterRepository.findAllByOrderByUserStudentNumAsc();
            if(classEntities.isEmpty()) return GetCodingZoneStudentListResponseDto.noExistArticle();

            for(CodingZoneRegisterEntity codingZoneRegisterEntity: classEntities){
                CodingZoneClass codingZoneClass = codingZoneClassRepository.findByClassNum(codingZoneRegisterEntity.getClassNum());
                CodingZoneStudentListItem codingZoneStudentListItem = new CodingZoneStudentListItem(codingZoneClass, codingZoneRegisterEntity);
                studentList.add(codingZoneStudentListItem);
            }
        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetCodingZoneStudentListResponseDto.success(studentList);

    }
 
}
