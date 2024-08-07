package com.icehufs.icebreaker.service;

import org.springframework.http.ResponseEntity;

import com.icehufs.icebreaker.dto.request.codingzone.*;
import com.icehufs.icebreaker.dto.response.codingzone.*;


import java.util.List;

public interface CodingZoneService {
    //admin(과사 조교) 권한을 위한 로직
    ResponseEntity<? super CodingZoneClassAssignResponseDto> codingzoneClassAssign(List<CodingZoneClassAssignRequestDto> dto, String email);
    ResponseEntity<? super GroupInfUpdateResponseDto> uploadInf(List<GroupInfUpdateRequestDto> dto, String email);
    ResponseEntity<? super GetListOfGroupInfResponseDto> getList(String groupId, String email);
    ResponseEntity<? super GroupInfUpdateResponseDto> patchInf(List<PatchGroupInfRequestDto> dto, String email);
    ResponseEntity<? super DeleteClassOfGroupResponseDto> deleteClass(Integer classNum, String email);
    ResponseEntity<? super GetCodingZoneStudentListResponseDto> getStudentList(String email);
    ResponseEntity<? super DeleteAllInfResponseDto> deleteAll(String email);

    //권한이 필요없는 로직
    ResponseEntity<? super AuthorityExistResponseDto> authExist(String email);
    ResponseEntity<? super CodingZoneRegisterResponseDto> classRegist(Integer classNum, String email);
    ResponseEntity<? super CodingZoneCanceResponseDto> classCance(Integer classNum, String email);
    ResponseEntity<? super GetListOfCodingZoneClassResponseDto> getClassList(Integer grade, String email);
    ResponseEntity<? super GetCountOfAttendResponseDto> getAttend(Integer grade,String email);
    ResponseEntity<? super GetPersAttendListItemResponseDto> getPerAttendList(String email);
    ResponseEntity<? super GetReservedClassListItemResponseDto> getReservedClass(String classDate, String email);

    //수업 코딩존 조교 
    ResponseEntity<? super PutAttendanceResponseDto> putAttend(Integer registNum, String email);


}
