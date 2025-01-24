package com.icehufs.icebreaker.domain.codingzone.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;

import com.icehufs.icebreaker.domain.codingzone.dto.request.CodingZoneClassAssignRequestDto;
import com.icehufs.icebreaker.domain.codingzone.dto.request.GroupInfUpdateRequestDto;
import com.icehufs.icebreaker.domain.codingzone.dto.request.HandleAuthRequestDto;
import com.icehufs.icebreaker.domain.codingzone.dto.request.PatchGroupInfRequestDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.AuthorityExistResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.CodingZoneCanceResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.CodingZoneClassAssignResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.CodingZoneRegisterResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.DeleteAllInfResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.DeleteClassResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.DepriveAuthResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.GetCodingZoneAssitantListResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.GetCodingZoneStudentListResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.GetCountOfAttendResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.GetListOfCodingZoneClassForNotLogInResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.GetListOfCodingZoneClassResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.GetListOfGroupInfResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.GetPersAttendListItemResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.GetReservedClassListItemResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.GiveAuthResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.GroupInfUpdateResponseDto;
import com.icehufs.icebreaker.domain.codingzone.dto.response.PutAttendanceResponseDto;
import com.icehufs.icebreaker.domain.codingzone.domain.vo.CodingZoneStudentListItem;
import com.icehufs.icebreaker.domain.codingzone.domain.vo.PersAttendManagListItem;
import com.icehufs.icebreaker.domain.codingzone.domain.vo.ReservedClassListItem;
import com.icehufs.icebreaker.dto.response.ResponseDto;
import com.icehufs.icebreaker.domain.article.dto.response.CheckOwnOfArticleResponseDto;
import com.icehufs.icebreaker.domain.auth.domain.entity.Authority;
import com.icehufs.icebreaker.domain.codingzone.domain.entity.CodingZoneClass;
import com.icehufs.icebreaker.domain.codingzone.domain.entity.CodingZoneRegister;
import com.icehufs.icebreaker.domain.codingzone.domain.entity.GroupInf;
import com.icehufs.icebreaker.domain.membership.domain.entity.User;
import com.icehufs.icebreaker.domain.auth.repostiory.AuthorityRepository;
import com.icehufs.icebreaker.domain.codingzone.repository.CodingZoneClassRepository;
import com.icehufs.icebreaker.domain.codingzone.repository.CodingZoneRegisterRepository;
import com.icehufs.icebreaker.domain.codingzone.repository.GroupInfRepository;
import com.icehufs.icebreaker.domain.membership.repository.UserRepository;
import com.icehufs.icebreaker.domain.codingzone.service.CodingZoneService;

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

            Authority authority = authorityRepository.findByEmail(email);
            if(authority == null) return AuthorityExistResponseDto.notExistUser();
 
            String entireAdmin = authority.getRoleAdmin();
            String codingC1Admin = authority.getRoleAdminC1();
            String codingC2Admin = authority.getRoleAdminC2();

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
                    GroupInf groupInf = new GroupInf(requestDto);
                    groupInfRepository.save(groupInf);
                }
            }
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GroupInfUpdateResponseDto.success();
    }

    @Override
    public ResponseEntity<? super GetListOfGroupInfResponseDto> getList(String groupId, String email) {
        List<GroupInf> groupInfEntities = new ArrayList<>();
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetListOfGroupInfResponseDto.notExistUser();

            groupInfEntities = groupInfRepository.findByGroupId(groupId);
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
                GroupInf existingEntity = groupInfRepository.findByClassNum(dtos.getClassNum());
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
    public ResponseEntity<? super DeleteClassResponseDto> deleteClass(Integer classNum, String email) {
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return DeleteClassResponseDto.notExistUser();

            CodingZoneClass codingZoneClass = codingZoneClassRepository.findByClassNum(classNum);
            if (codingZoneClass == null) return DeleteClassResponseDto.noExistArticle();

            codingZoneClassRepository.delete(codingZoneClass);

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return DeleteClassResponseDto.success();
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
    
            CodingZoneRegister codingZoneRegister = codingZoneRegisterRepository.findByClassNumAndUserEmail(classNum, email);
            if (codingZoneRegister != null) {
                return CodingZoneRegisterResponseDto.alreadyReserve(); //해당 수업을 이미 예약했을 때
            }
    
            // 인원 초과 처리
            if (codingZoneClass.getCurrentNumber() >= codingZoneClass.getMaximumNumber()) {
                return CodingZoneRegisterResponseDto.fullClass();
            }
    
            // 신청한 수업 등록
            String userName = userEntity.getName();
            String userStudentNum = userEntity.getStudentNum();
            int grade = codingZoneClass.getGrade();
            CodingZoneRegister newRegisterEntity = new CodingZoneRegister(grade, email, userName, userStudentNum, classNum);
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
            CodingZoneRegister codingZoneRegister = codingZoneRegisterRepository.findByClassNumAndUserEmail(classNum, email);
            if (codingZoneRegister == null) {
                return CodingZoneCanceResponseDto.notReserve();
            }
    
            codingZoneRegisterRepository.delete(codingZoneRegister);
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

        CodingZoneRegister codingZoneRegister = codingZoneRegisterRepository.findByRegistrationId(registNum);
        if(codingZoneRegister == null) return PutAttendanceResponseDto.validationFailed();

        // 출석 상태 업데이트
        if ("0".equals(codingZoneRegister.getAttendance())) { // 결석(미출석) -> 출석
            codingZoneRegister.putAttend();
        } else {
            codingZoneRegister.putNotAttend(); // 출석 -> 결석
        }
        codingZoneRegisterRepository.save(codingZoneRegister);

        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PutAttendanceResponseDto.success();
    }

    @Override
    public ResponseEntity<? super GetListOfCodingZoneClassResponseDto> getClassList(Integer grade, String email) {
    List<CodingZoneClass> classEntities = new ArrayList<>();
        int registedClassNum = 0;
        try {
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetListOfCodingZoneClassResponseDto.notExistUser();

            if (grade != 1 && grade != 2) return GetListOfCodingZoneClassResponseDto.validationFailed();

            // 현재 날짜가 수요일에서 일요일 사이인지 확인 (Asia/Seoul 시간대 적용)
            ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
            DayOfWeek dayOfWeek = now.getDayOfWeek();
            if (dayOfWeek.getValue() < DayOfWeek.THURSDAY.getValue()) {
                return GetListOfCodingZoneClassResponseDto.noExistArticle();
            }

            // 다음 주 월요일과 일요일 계산 (Asia/Seoul 시간대 적용)
            ZonedDateTime nextMonday = now.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
            ZonedDateTime nextSunday = nextMonday.plusDays(6);

            // 다음 주 월요일부터 일요일까지의 수업만 조회
            classEntities = codingZoneClassRepository.findByGradeAndClassDateBetween(
                grade, 
                nextMonday.format(DateTimeFormatter.ISO_LOCAL_DATE), 
                nextSunday.format(DateTimeFormatter.ISO_LOCAL_DATE)
            );
            if (classEntities.isEmpty()) return GetListOfCodingZoneClassResponseDto.noExistArticle();

            for (CodingZoneClass classEntitie : classEntities) {
                CodingZoneRegister codingZoneRegister = codingZoneRegisterRepository.findByClassNumAndUserEmail(classEntitie.getClassNum(), email);
                if (codingZoneRegister != null) {
                    registedClassNum = classEntitie.getClassNum();
                    break;
                }
            }

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetListOfCodingZoneClassResponseDto.success(registedClassNum, classEntities);
    }


    @Override
    public ResponseEntity<? super GetListOfCodingZoneClassForNotLogInResponseDto> getClassList2(Integer grade) {
        List<CodingZoneClass> classEntities = new ArrayList<>();
        try {
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            if (grade != 1 && grade != 2) return GetListOfCodingZoneClassForNotLogInResponseDto.validationFailed();

            // 현재 날짜가 수요일에서 일요일 사이인지 확인 (Asia/Seoul 시간대 적용)
            ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
            DayOfWeek dayOfWeek = now.getDayOfWeek();
            if (dayOfWeek.getValue() < DayOfWeek.THURSDAY.getValue()) {
                return GetListOfCodingZoneClassForNotLogInResponseDto.noExistArticle();
            }

            // 다음 주 월요일과 일요일 계산 (Asia/Seoul 시간대 적용)
            ZonedDateTime nextMonday = now.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
            ZonedDateTime nextSunday = nextMonday.plusDays(6);

            // 다음 주 월요일부터 일요일까지의 수업만 조회
            classEntities = codingZoneClassRepository.findByGradeAndClassDateBetween(
                grade, 
                nextMonday.format(DateTimeFormatter.ISO_LOCAL_DATE), 
                nextSunday.format(DateTimeFormatter.ISO_LOCAL_DATE)
            );
    
            if (classEntities.isEmpty()) return GetListOfCodingZoneClassForNotLogInResponseDto.noExistArticle();

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetListOfCodingZoneClassForNotLogInResponseDto.success(classEntities);
    }

    @Override
    public ResponseEntity<? super GetCountOfAttendResponseDto> getAttend(Integer grade, String email) {
        Integer NumOfAttend = 0;
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        List<CodingZoneRegister> classEntities = new ArrayList<>();
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetCountOfAttendResponseDto.notExistUser();

            // 학년 검증
            if(grade != 1 && grade != 2) return GetCountOfAttendResponseDto.validationFailed();

            classEntities = codingZoneRegisterRepository.findByGrade(grade);
            if(classEntities.isEmpty()) return GetCountOfAttendResponseDto.success(NumOfAttend);

            for (CodingZoneRegister entity : classEntities){
                if(entity.getUserEmail().equals(email)){
                    String attend = entity.getAttendance();
                    if (attend.equals("1")){
                        NumOfAttend++;
                    }
                    if (attend.equals("0")){
                        CodingZoneClass codingZoneClass = codingZoneClassRepository.findByClassNum(entity.getClassNum());

                        LocalDate classDate = LocalDate.parse(codingZoneClass.getClassDate()); // 예: "2024-11-01"
                        LocalTime classTime = LocalTime.parse(codingZoneClass.getClassTime()); // 예: "10:00:00"

                        ZonedDateTime classDateTime = ZonedDateTime.of(classDate, classTime, ZoneId.of("Asia/Seoul"));

                        // classDateTime이 now보다 과거일 경우 NumOfAttend 감소
                        if (classDateTime.isBefore(now)) {
                            NumOfAttend--;
                        }
                    }
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
        List<CodingZoneRegister> classEntities = new ArrayList<>();
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetPersAttendListItemResponseDto.notExistUser();

            //아직 출/결한 수업이 없을 때
            classEntities = codingZoneRegisterRepository.findByUserEmail(email);
            if(classEntities.isEmpty()) return GetPersAttendListItemResponseDto.noExistArticle();

            for(CodingZoneRegister codingZoneRegister : classEntities){
                CodingZoneClass codingZoneClass = codingZoneClassRepository.findByClassNum(codingZoneRegister.getClassNum());
                PersAttendManagListItem persAttendManagListItem = new PersAttendManagListItem(codingZoneClass,
                    codingZoneRegister);
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
        List<CodingZoneRegister> classEntities = new ArrayList<>();
        try{
            // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GetCodingZoneStudentListResponseDto.notExistUser();

            //아직 출/결한 수업이 없을 때
            classEntities = codingZoneRegisterRepository.findAllByOrderByUserStudentNumAsc();
            if(classEntities.isEmpty()) return GetCodingZoneStudentListResponseDto.noExistArticle();

            for(CodingZoneRegister codingZoneRegister : classEntities){
                CodingZoneClass codingZoneClass = codingZoneClassRepository.findByClassNum(codingZoneRegister.getClassNum());
                CodingZoneStudentListItem codingZoneStudentListItem = new CodingZoneStudentListItem(codingZoneClass,
                    codingZoneRegister);
                studentList.add(codingZoneStudentListItem);
            }
        }catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetCodingZoneStudentListResponseDto.success(studentList);

    }

    @Override
    public ResponseEntity<? super GetReservedClassListItemResponseDto> getReservedClass(String classDate,
            String email) {
                List<ReservedClassListItem> studentList = new ArrayList<>();
                List<CodingZoneRegister> classEntities = new ArrayList<>();
                int kindOfClass = 0;
                try{
                    // 사용자 계정이 존재하는지(로그인 시간이 초과됐는지) 확인하는 코드
                    User user = userRepository.findByEmail(email);
                    if (user == null) return GetReservedClassListItemResponseDto.notExistUser();

                    Authority authority = authorityRepository.findByEmail(email);
                    if(!"NULL".equals(authority.getRoleAdminC1())){
                        kindOfClass = 1;
                    }
                    if(!"NULL".equals(authority.getRoleAdminC2())){
                        kindOfClass = 2;
                    }

                    classEntities = codingZoneRegisterRepository.findByGrade(kindOfClass);
                    //예약한 학생이 없을 때
                    if(classEntities.isEmpty()) return GetReservedClassListItemResponseDto.noExistArticle();
        
                    for(CodingZoneRegister codingZoneRegister : classEntities){
                        CodingZoneClass codingZoneClass = codingZoneClassRepository.findByClassNum(codingZoneRegister.getClassNum());
                        if(classDate.equals(codingZoneClass.getClassDate())){
                            ReservedClassListItem reservedClassListItem = new ReservedClassListItem(codingZoneClass,
                                codingZoneRegister);
                            studentList.add(reservedClassListItem);
                        }
                    }
                }catch(Exception exception) {
                    exception.printStackTrace();
                    return ResponseDto.databaseError();
                }
                if(studentList.isEmpty()) return GetReservedClassListItemResponseDto.noExistArticle();
                return GetReservedClassListItemResponseDto.success(studentList);

    }

    @Override
    public ResponseEntity<? super DeleteAllInfResponseDto> deleteAll(String email) {
        try {
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return DeleteAllInfResponseDto.notExistUser();

            // 코딩존 관련 모든 테이블 초기화
            deleteAllData();

            // 코딩존 조교 권한 취소
            updateAuthorities();

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return DeleteAllInfResponseDto.success();
    }

    //학기 초기화를 위한 트렌젝션 분리
    @Transactional
    private void deleteAllData() {
        codingZoneRegisterRepository.deleteAll();
        groupInfRepository.deleteAll();
        codingZoneClassRepository.deleteAll();
    }

    //학기 초기화를 위한 트렌젝션 분리
    @Transactional
    private void updateAuthorities() {
        String C1 = "ROLE_ADMINC1";
        String C2 = "ROLE_ADMINC2";
        List<Authority> users = authorityRepository.findByRoleAdminC1(C1);
        List<Authority> users2 = authorityRepository.findByRoleAdminC2(C2);

        users.forEach(authorityEntity -> {
            authorityEntity.setRoleAdminC1("NULL");
            authorityEntity.setGivenDateAdminC(null);
            authorityRepository.save(authorityEntity);
        });
        users2.forEach(authorityEntity -> {
            authorityEntity.setRoleAdminC2("NULL");
            authorityEntity.setGivenDateAdminC(null);
            authorityRepository.save(authorityEntity);
        });
    }

    @Override
    public ResponseEntity<? super GiveAuthResponseDto> giveAuth(String email, HandleAuthRequestDto dto) {
        try{
            //로그인된 사용자 토큰 시간 만료시 발생
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return GiveAuthResponseDto.notExistUser();

            //권한을 주려하는 사용자가 회원가입이 안되어있을 때
            Authority authority = authorityRepository.findByEmail(dto.getEmail());
            if (authority == null) return GiveAuthResponseDto.notSingUpUser();

            if("ROLE_ADMIN1".equals(dto.getRole())){
                if(authority.getRoleAdmin1().equals(dto.getRole())) return GiveAuthResponseDto.alreadyPerm(); //특정 권한이 이미 있을 떄
                authority.giveAdmin1Auth();
            }else if("ROLE_ADMINC1".equals(dto.getRole())){
                if(authority.getRoleAdminC1().equals("ROLE_ADMINC1") || authority.getRoleAdminC2().equals("ROLE_ADMINC2")) return GiveAuthResponseDto.alreadyPerm(); //특정 권한이 이미 있을 떄
                authority.giveAdminC1Auth();
            }else if("ROLE_ADMINC2".equals(dto.getRole())){
                if(authority.getRoleAdminC1().equals("ROLE_ADMINC1") || authority.getRoleAdminC2().equals("ROLE_ADMINC2")) return GiveAuthResponseDto.alreadyPerm(); //특정 권한이 이미 있을 떄
                authority.giveAdminC2Auth();
            }
            authorityRepository.save(authority);

        } catch (Exception exception){
            exception.printStackTrace();
            return GiveAuthResponseDto.databaseError();
    }
    return GiveAuthResponseDto.success();
    }

    @Override
    public ResponseEntity<? super DepriveAuthResponseDto> depriveAuth(String email, HandleAuthRequestDto dto){
        try{
            //로그인된 사용자 토큰 시간 만료시 발생
            boolean existedUser = userRepository.existsByEmail(email);
            if (!existedUser) return DepriveAuthResponseDto.notExistUser();

            //권한을 주려하는 사용자가 회원가입이 안되있을 때
            Authority authority = authorityRepository.findByEmail(dto.getEmail());
            if (authority == null) return DepriveAuthResponseDto.notSingUpUser();

            if("ROLE_ADMIN1".equals(dto.getRole())){
                if(authority.getRoleAdmin1().equals("NULL")) return GiveAuthResponseDto.alreadyPerm(); // 박탈하려히는 특정 권한이 없을 때
                authority.setRoleAdmin1("NULL");
                authority.setGivenDateAdmin1(null);
            }else if("ROLE_ADMINC1".equals(dto.getRole())){
                if(authority.getRoleAdminC1().equals("NULL")) return GiveAuthResponseDto.alreadyPerm(); // 박탈하려히는 특정 권한이 없을 때
                authority.setRoleAdminC1("NULL");
                authority.setGivenDateAdminC(null);
            }else if("ROLE_ADMINC2".equals(dto.getRole())){
                if(authority.getRoleAdminC2().equals("NULL")) return GiveAuthResponseDto.alreadyPerm(); // 박탈하려히는 특정 권한이 없을 때
                authority.setRoleAdminC2("NULL");
                authority.setGivenDateAdminC(null);
            }
            authorityRepository.save(authority);

        } catch (Exception exception){
            exception.printStackTrace();
            return DepriveAuthResponseDto.databaseError();
    }
    return DepriveAuthResponseDto.success();
    }

    @Override
    public ResponseEntity<? super GetCodingZoneAssitantListResponseDto> getAssistantList() {
        List<User> ListOfCodingZone1 = new ArrayList<>();
        List<User> ListOfCodingZone2 = new ArrayList<>();
        try {
            String C1 = "ROLE_ADMINC1";
            String C2 = "ROLE_ADMINC2";
            List<Authority> users = authorityRepository.findByRoleAdminC1(C1);
            List<Authority> users2 = authorityRepository.findByRoleAdminC2(C2);
            if(users.isEmpty() || users2.isEmpty()) return GetCodingZoneAssitantListResponseDto.notExistUser();
    
            users.forEach(authorityEntity -> {
                User user = userRepository.findByEmail(authorityEntity.getEmail());
                ListOfCodingZone1.add(user);
            });
            users2.forEach(authorityEntity -> {
                User user = userRepository.findByEmail(authorityEntity.getEmail());
                ListOfCodingZone2.add(user);
            });

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetCodingZoneAssitantListResponseDto.success(ListOfCodingZone1, ListOfCodingZone2);
    }
}