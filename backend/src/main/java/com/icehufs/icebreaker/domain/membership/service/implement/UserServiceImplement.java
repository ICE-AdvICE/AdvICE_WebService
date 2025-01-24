package com.icehufs.icebreaker.domain.membership.service.implement;


import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.icehufs.icebreaker.domain.membership.dto.request.AuthorityRequestDto;
import com.icehufs.icebreaker.domain.membership.dto.request.PatchUserPassRequestDto;
import com.icehufs.icebreaker.domain.membership.dto.request.PatchUserRequestDto;
import com.icehufs.icebreaker.domain.membership.dto.response.Authority1ExistResponseDto;
import com.icehufs.icebreaker.domain.membership.dto.response.AuthorityResponseDto;
import com.icehufs.icebreaker.domain.membership.dto.response.DeleteUserResponseDto;
import com.icehufs.icebreaker.domain.membership.dto.response.GetSignInUserResponseDto;
import com.icehufs.icebreaker.domain.membership.dto.response.PatchUserPassResponseDto;
import com.icehufs.icebreaker.domain.membership.dto.response.PatchUserResponseDto;
import com.icehufs.icebreaker.common.ResponseDto;
import com.icehufs.icebreaker.domain.auth.domain.entity.Authority;
import com.icehufs.icebreaker.domain.membership.domain.entity.User;
import com.icehufs.icebreaker.domain.auth.repostiory.AuthorityRepository;
import com.icehufs.icebreaker.domain.membership.repository.UserRepository;
import com.icehufs.icebreaker.domain.membership.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email) {
        User userEntity = null;

        try {
            userEntity = userRepository.findByEmail(email);
            if (userEntity == null ) return GetSignInUserResponseDto.notExistUser();

        } catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetSignInUserResponseDto.success(userEntity);
    }

    @Override
    public ResponseEntity<? super PatchUserResponseDto> patchUser(PatchUserRequestDto dto, String email){
                try{

                    User userEntity = userRepository.findByEmail(email);
                    if(userEntity == null) return PatchUserResponseDto.notExistUser();

                    userEntity.patchUser(dto);
                    userRepository.save(userEntity);
        
                }catch(Exception exception){
                    exception.printStackTrace();
                    return ResponseDto.databaseError();
                }
                
                return PatchUserResponseDto.success();
            }

    @Override
    public ResponseEntity<? super PatchUserPassResponseDto> patchUserPass(PatchUserPassRequestDto dto) {
        try{

            User userEntity = userRepository.findByEmail(dto.getEmail());
            if(userEntity == null) return PatchUserResponseDto.notExistUser();

            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);

            dto.setPassword(encodedPassword);
            userEntity.patchUserPass(dto);
            userRepository.save(userEntity);

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        
        return PatchUserPassResponseDto.success();
    }

    @Override
    public ResponseEntity<? super DeleteUserResponseDto> deleteUser(String email) {
        try{

            User userEntity = userRepository.findByEmail(email);
            if(userEntity == null) return DeleteUserResponseDto.notExistUser();

            
            authorityRepository.deleteById(email);
            userRepository.delete(userEntity);

        }catch(Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        
        return DeleteUserResponseDto.success();
    }

    @Override
    public ResponseEntity<? super AuthorityResponseDto> giveAuthority(AuthorityRequestDto dto, String email) {

        try{

            Authority authority = authorityRepository.findByEmail(email);
            if(authority == null) return AuthorityResponseDto.notExistUser();
 
            //System.out.println(admin1);
            if(dto.getRoleAdmin1() == 1){ //익명게시판 운영자 권한 부여
                authority.giveAdmin1Auth();
            }

            if(dto.getRoleAdminC1() == 1){ //코딩존 운영자 권한 부여
                authority.giveAdminC1Auth();
            }

            if(dto.getRoleAdminC2() == 1){ //코딩존 운영자 권한 부여
                authority.giveAdminC2Auth();
            }

            if(dto.getRoleAdmin() == 1){ //코딩존 운영자 권한 부여
                authority.giveAdminAuth();
            }
            authorityRepository.save(authority);

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
    }
    return AuthorityResponseDto.success();
    }
    

    @Override
    public ResponseEntity<? super Authority1ExistResponseDto> auth1Exist(String email) {

        try{

            Authority authority = authorityRepository.findByEmail(email);
            if(authority == null) return Authority1ExistResponseDto.notExistUser();
 
            String admin1 = authority.getRoleAdmin1();
            if("NULL".equals(admin1)){
                return Authority1ExistResponseDto.notAdmin();
            }

        } catch (Exception exception){
            exception.printStackTrace();
            return ResponseDto.databaseError();
    }
    return Authority1ExistResponseDto.success();
    }
}