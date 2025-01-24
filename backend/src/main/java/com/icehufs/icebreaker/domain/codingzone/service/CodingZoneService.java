package com.icehufs.icebreaker.domain.codingzone.service;

import org.springframework.http.ResponseEntity;

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

import java.util.List;

public interface CodingZoneService {
    //admin(과사 조교) 권한을 위한 로직
    ResponseEntity<? super CodingZoneClassAssignResponseDto> codingzoneClassAssign(List<CodingZoneClassAssignRequestDto> dto, String email);
    ResponseEntity<? super GroupInfUpdateResponseDto> uploadInf(List<GroupInfUpdateRequestDto> dto, String email);
    ResponseEntity<? super GetListOfGroupInfResponseDto> getList(String groupId, String email);
    ResponseEntity<? super GroupInfUpdateResponseDto> patchInf(List<PatchGroupInfRequestDto> dto, String email);
    ResponseEntity<? super DeleteClassResponseDto> deleteClass(Integer classNum, String email);
    ResponseEntity<? super GetCodingZoneStudentListResponseDto> getStudentList(String email);
    ResponseEntity<? super DeleteAllInfResponseDto> deleteAll(String email);
    ResponseEntity<? super GiveAuthResponseDto> giveAuth(String email, HandleAuthRequestDto dto);
    ResponseEntity<? super DepriveAuthResponseDto> depriveAuth(String email,HandleAuthRequestDto dto);

    //권한이 필요없는 로직
    ResponseEntity<? super AuthorityExistResponseDto> authExist(String email);
    ResponseEntity<? super CodingZoneRegisterResponseDto> classRegist(Integer classNum, String email);
    ResponseEntity<? super CodingZoneCanceResponseDto> classCance(Integer classNum, String email);
    ResponseEntity<? super GetListOfCodingZoneClassResponseDto> getClassList(Integer grade, String email);
    ResponseEntity<? super GetListOfCodingZoneClassForNotLogInResponseDto> getClassList2(Integer grade);
    ResponseEntity<? super GetCountOfAttendResponseDto> getAttend(Integer grade,String email);
    ResponseEntity<? super GetPersAttendListItemResponseDto> getPerAttendList(String email);
    ResponseEntity<? super GetReservedClassListItemResponseDto> getReservedClass(String classDate, String email);
    ResponseEntity<? super GetCodingZoneAssitantListResponseDto> getAssistantList();

    //수업 코딩존 조교 
    ResponseEntity<? super PutAttendanceResponseDto> putAttend(Integer registNum, String email);


}
